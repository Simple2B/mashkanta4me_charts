import pathlib
import urllib.parse
import csv
import requests
from config import BASE_DIR, BaseConfig as conf
from app.logger import log


DATASET_MAP_JSON = {
    "prime": "PRIME.csv",
    "const_w": "CONST_W_CPI.csv",
    "const_wo": "CONST_WO_CPI.csv",
    "eligibility": "ELIGIBILITY.csv",
    "variable_w": "VARIABLE_W_CPI.csv",
    "variable_wo": "VARIABLE_WO_CPI.csv",
}

DATA_DIR_NAME = "data"
EXCEL_FILES_DIR_NAME = "excel_files"

DATA_DIR = pathlib.Path(BASE_DIR, DATA_DIR_NAME)
EXCEL_FILES_DIR = pathlib.Path(DATA_DIR, EXCEL_FILES_DIR_NAME)

EXCEL_FILES_DIR.mkdir(parents=True, exist_ok=True)

DATA_PROCESSOR = {}


def data_processor(name: str):
    def decorator(func):
        DATA_PROCESSOR[name] = func

    return decorator


@data_processor("prime")
def get_prime_data(file_data: dict):
    def get_lvt_data(lvt_level):
        data_size = len(file_data["LTV"])
        LTV = {1: "LTV <= 45%", 2: "45% <= LTV <= 60%", 3: "LTV>=60 [%]"}
        idx = [i for i in range(data_size) if int(file_data["LTV"][i]) == lvt_level]
        return [
            dict(
                x=round(float(file_data["Years"][i])),
                y=float(file_data["Interest_rate"][i]),
                bank=file_data["Bank_name"][i],
                ltv=LTV[lvt_level],
            )
            for i in idx
        ]

    return [
        {
            "backgroundColor": "rgba(52, 216, 153, 1)",
            "data": get_lvt_data(1),
            "jsId": "LTV45",
            "label": "עד 45% מימון",
            "pointRadius": 7,
        },
        {
            "backgroundColor": "rgba(255, 203, 25, 1)",
            "data": get_lvt_data(2),
            "jsId": "LTV45-60",
            "label": "בין 45% ל- 60% מימון",
            "pointRadius": 7,
        },
        {
            "backgroundColor": "rgba(255, 107, 101, 1)",
            "data": get_lvt_data(3),
            "jsId": "LTV60",
            "label": "מעל 60% מימון",
            "pointRadius": 7,
        },
    ]


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

    def chart_data(self, chart_name: str) -> dict:
        if chart_name not in DATASET_MAP_JSON:
            log(log.WARNING, "Asked unknown chart_name: [%s]", chart_name)
            return {}
        file_name = DATASET_MAP_JSON[chart_name]
        try:
            data = self._basic_chart_data(pathlib.Path(EXCEL_FILES_DIR) / file_name)
        except UnicodeDecodeError:
            data = self._basic_chart_data(
                pathlib.Path(EXCEL_FILES_DIR) / file_name, encoding="utf-8"
            )
        if chart_name in DATA_PROCESSOR:
            return DATA_PROCESSOR[chart_name](data)

        return data
