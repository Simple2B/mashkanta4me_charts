import pathlib
import urllib.parse
import csv
import requests
from config import BASE_DIR, BaseConfig as conf
from app.logger import log
from flask_login import current_user


DATASET_MAP_JSON = {
    "prime": "PRIME.csv",
    "const_w": "CONST_W_CPI.csv",
    "const_wo": "CONST_WO_CPI.csv",
    "eligibility": "ELIGIBILITY.csv",
    "variable_w": "VARIABLE_W_CPI.csv",
    "variable_wo": "VARIABLE_WO_CPI.csv",
}

ANALYTICS = "analytics"

DATA_DIR_NAME = "data"
EXCEL_FILES_DIR_NAME = "excel_files"

DATA_DIR = pathlib.Path(BASE_DIR, DATA_DIR_NAME)
EXCEL_FILES_DIR = pathlib.Path(DATA_DIR, EXCEL_FILES_DIR_NAME)

EXCEL_FILES_DIR.mkdir(parents=True, exist_ok=True)

DATA_PROCESSOR = {}


def data_processor(name: str, bank_view=False):
    def decorator(func):
        if name not in DATA_PROCESSOR:
            DATA_PROCESSOR[name] = {}
        DATA_PROCESSOR[name][bank_view] = func
        return func

    return decorator


@data_processor("prime")
@data_processor("const_w")
@data_processor("const_wo")
@data_processor("eligibility")
@data_processor("variable_w")
@data_processor("variable_wo")
def get_prime_data_ltv_view(file_data: dict, options: dict = {}):
    years = [round(float(year)) for year in file_data["Years"]]
    rates = [float(rate) for rate in file_data["Interest_rate"]]
    max_x = max(years)
    min_x = min(years)
    max_y = max(rates)
    min_y = min(rates)
    range_years = options["years"] if "years" in options else [min_x, max_x]
    range_loan = options["loan"] if "loan" in options else [min_y, max_y]
    data_size = len(file_data["LTV"])
    LTV = {1: "LTV <= 45%", 2: "45% <= LTV <= 60%", 3: "LTV>=60 [%]"}
    all_banks = list(set(file_data["Bank_name"]))
    banks = options["banks"] if "banks" in options else all_banks
    loan_numbers = [n for n in file_data["loan_number"]]

    def get_lvt_data(lvt_level):
        idx = [
            i
            for i in range(data_size)
            if int(file_data["LTV"][i]) == lvt_level
            and file_data["Bank_name"][i] in banks
            and range_years[0] <= years[i] <= range_years[1]
            and range_loan[0] <= rates[i] <= range_loan[1]
        ]
        return [
            dict(
                x=years[i],
                y=rates[i],
                bank=file_data["Bank_name"][i],
                ltv=LTV[lvt_level],
                loan_number=loan_numbers[i]
                if current_user and current_user.role == "paid"
                else None,
            )
            for i in idx
        ]

    data = {
        "banks": all_banks,
        "maxX": max_x,
        "minX": min_x,
        "maxY": max_y,
        "minY": min_y,
        "dataSet": [],
    }
    ltvs = options["ltv"] if "ltv" in options else ["LTV45", "LTV45-60", "LTV60"]
    if "LTV45" in ltvs:
        data["dataSet"] += [
            {
                "backgroundColor": "rgba(52, 216, 153, 1)",
                "data": get_lvt_data(1),
                "jsId": "LTV45",
                "label": "עד 45% מימון",
                "pointRadius": 7,
            }
        ]
    if "LTV45-60" in ltvs:
        data["dataSet"] += [
            {
                "backgroundColor": "rgba(255, 203, 25, 1)",
                "data": get_lvt_data(2),
                "jsId": "LTV45-60",
                "label": "בין 45% ל- 60% מימון",
                "pointRadius": 7,
            }
        ]
    if "LTV60" in ltvs:
        data["dataSet"] += [
            {
                "backgroundColor": "rgba(255, 107, 101, 1)",
                "data": get_lvt_data(3),
                "jsId": "LTV60",
                "label": "מעל 60% מימון",
                "pointRadius": 7,
            }
        ]
    return data


@data_processor("prime", bank_view=True)
@data_processor("const_w", bank_view=True)
@data_processor("const_wo", bank_view=True)
@data_processor("eligibility", bank_view=True)
@data_processor("variable_w", bank_view=True)
@data_processor("variable_wo", bank_view=True)
def get_prime_data_bank_view(file_data: dict, options: dict = {}):
    years = [round(float(year)) for year in file_data["Years"]]
    rates = [float(rate) for rate in file_data["Interest_rate"]]
    max_x = max(years)
    min_x = min(years)
    max_y = max(rates)
    min_y = min(rates)
    range_years = options["years"] if "years" in options else [min_x, max_x]
    range_loan = options["loan"] if "loan" in options else [min_y, max_y]
    data_size = len(file_data["LTV"])
    LTV = {1: "LTV <= 45%", 2: "45% <= LTV <= 60%", 3: "LTV>=60 [%]"}
    all_banks = list(set(file_data["Bank_name"]))
    banks = options["banks"] if "banks" in options else all_banks
    ltvs = options["ltv"] if "ltv" in options else ["LTV45", "LTV45-60", "LTV60"]
    LTV_INDEXES = {"LTV45": 1, "LTV45-60": 2, "LTV60": 3}
    ltv_indexes = [LTV_INDEXES[ltv] for ltv in ltvs]
    ltvs_all = [int(ltv) for ltv in file_data["LTV"]]
    loan_numbers = [n for n in file_data["loan_number"]]

    def get_color(index):
        import random

        colors = [
            "rgba(255, 203, 25, 1)",
            "rgba(255, 167, 25, 1)",
            "rgba(52, 216, 153, 1)",
            "rgba(16, 163, 255, 1)",
            "rgba(255, 107, 101, 1)",
            "rgba(121, 52, 216, 1)",
            "rgba(216, 52, 121, 1)",
            "rgba(168, 25, 177, 1)",
        ]
        if index >= len(colors):
            return f"rgba({random.randint(0, 255)}, {random.randint(0, 255)}, {random.randint(0, 255)}, 1)"
        return colors[index]

    def get_bank_data(bank_name):
        idx = [
            i
            for i in range(data_size)
            if int(file_data["LTV"][i]) in ltv_indexes
            and file_data["Bank_name"][i] == bank_name
            and range_years[0] <= years[i] <= range_years[1]
            and range_loan[0] <= rates[i] <= range_loan[1]
        ]
        return [
            dict(
                x=years[i],
                y=rates[i],
                bank=bank_name,
                ltv=LTV[ltvs_all[i]],
                loan_number=loan_numbers[i]
                if current_user and current_user.role == "paid"
                else None,
            )
            for i in idx
        ]

    data = {
        "banks": all_banks,
        "maxX": max_x,
        "minX": min_x,
        "maxY": max_y,
        "minY": min_y,
        "dataSet": [],
    }
    for i, bank in enumerate(banks):
        data["dataSet"] += [
            {
                "backgroundColor": get_color(i),
                "data": get_bank_data(bank),
                "jsId": bank,
                "label": bank,
                "pointRadius": 7,
            }
        ]
    return data


class ChartDataSource(object):
    def __init__(self) -> None:
        super().__init__()

    def update(self) -> None:
        log(log.INFO, "Update file from [%s]", conf.STATISTICS_DATABASE_URL)
        for file_name in DATASET_MAP_JSON.values():
            url = urllib.parse.urljoin(conf.STATISTICS_DATABASE_URL, file_name)
            log(log.INFO, "Download [%s] from [%s]", file_name, url)
            res = requests.get(url)
            with open(pathlib.Path(EXCEL_FILES_DIR) / file_name, "wb") as f:
                f.write(res.content)

    @property
    def charts(self):
        return DATASET_MAP_JSON.keys()

    def _basic_chart_data(self, file_path: str, encoding: str = "iso8859-8") -> dict:
        with open(file_path, "r", encoding=encoding) as file:
            csv_reader = csv.reader(file)
            keys = None
            data = None
            for row in csv_reader:
                if not keys:
                    keys = row
                    data = {k: [] for k in keys}
                else:
                    for k, v in zip(keys, row):
                        data[k] += [v]
        return data

    def get_csv_file_data(self, file_name: str) -> dict:
        try:
            return self._basic_chart_data(pathlib.Path(EXCEL_FILES_DIR) / file_name)
        except UnicodeDecodeError:
            return self._basic_chart_data(
                pathlib.Path(EXCEL_FILES_DIR) / file_name, encoding="utf-8"
            )

    def chart_data(self, chart_name: str, options: dict = {}) -> dict:
        if chart_name == ANALYTICS:
            return self.analytics_data(options)
        if chart_name not in DATASET_MAP_JSON:
            log(log.WARNING, "Asked unknown chart_name: [%s]", chart_name)
            return {}
        bank_view = options["bankView"] if "bankView" in options else False
        file_name = DATASET_MAP_JSON[chart_name]
        data = self.get_csv_file_data(file_name)
        if chart_name in DATA_PROCESSOR:
            return DATA_PROCESSOR[chart_name][bank_view](data, options)

        return data

    def analytics_data(self, options: dict = {}) -> dict:
        if "q" not in options:
            return {}
        q = options["q"]

        if q == "options":
            monthly_return_edges = [round(float(i), 2) for i in self.get_csv_file_data("monthly_return_edges.csv")]
            mortgage_cost_edges = [round(float(i), 2) for i in self.get_csv_file_data("mortgage_cost_edges.csv")]
            payment_halved_edges = [round(float(i)) for i in self.get_csv_file_data("payment_halved_edges.csv")]
            data = {
                "viewTypeFilters": {
                    "MonthlyReturnEdge": {
                        "label": "זינוק מקסימלי חזוי בהחזר החודשי",
                        "buttons": [
                            {"label": f"{s}% עד", "name": f"less {s}"}
                            for s in monthly_return_edges
                        ],
                    },
                    "MortgageCostEdges": {
                        "label": "עלות לשקל בודד [ש״ח]",
                        "buttons": [
                            {"label": f"{i} עד", "name": f"less {i}"}
                            for i in mortgage_cost_edges
                        ],
                    },
                    "PaymentHalvedEdges": {
                        "label": "מתי הקרן תרד במחצית - כתלות בגודלה ובהחזר החודשי (הראשוני)",
                        "buttons": [
                            {
                                "label": f"בין {payment_halved_edges[i-1]} ל- {payment_halved_edges[i]} שנים",
                                "name": f"less {payment_halved_edges[i]}%"
                            }
                            if i > 0 else
                            {
                                "label": f"עד {payment_halved_edges[i]} שנים",
                                "name": f"less {payment_halved_edges[i]}%"
                            }
                            for i in range(len(payment_halved_edges))
                        ],
                    },
                }
            }
            # "מעל 40%"
            s = monthly_return_edges[-1]
            data["viewTypeFilters"]["MonthlyReturnEdge"]["buttons"] += [{"label": f"{s}% מעל", "name": f"more {s}"}]
            s = mortgage_cost_edges[-1]
            data["viewTypeFilters"]["MortgageCostEdges"]["buttons"] += [{"label": f"{s} מעל", "name": f"more {s}"}]
            s = payment_halved_edges[-1]
            data["viewTypeFilters"]["PaymentHalvedEdges"]["buttons"] += [{"label": f"מעל {s} שנים", "name": f"more {s}"}]
        else:
            pass
        return data
