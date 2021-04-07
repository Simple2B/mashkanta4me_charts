import logging
import json
import pathlib
import operator

import chardet
import pandas as pd

from backend.configurations import EXCEL_FILES_DIR, JSON_FILES_DIR

logging.basicConfig(
    format="[ %(asctime)s ] [ %(levelname)s ] - %(message)s", level=logging.INFO
)

color_palette = [
    "rgba(255, 107, 101, 1)",
    "rgba(255, 131, 101, 1)",
    "rgba(255, 148, 101, 1)",
    "rgba(255, 167, 25, 1)",
    "rgba(255, 203, 25, 1)",
    "rgba(52, 216, 153, 1)",
    "rgba(52, 203, 216, 1)",
    "rgba(52, 172, 216, 1)",
    "rgba(16, 163, 255, 1)",
    "rgba(121, 52, 216, 1)",
]

# ####################### 1: interest routes #######################


def constant_WO_cpi_index(df):
    return json.dumps((interest(df), interest_by_bank(df)))


def constant_W_cpi_index(df):
    return json.dumps((interest(df), interest_by_bank(df)))


def eligibility(df):
    return json.dumps((interest(df), interest_by_bank(df)))


def prime_index(df):
    return json.dumps((interest(df), interest_by_bank(df)))


def variable_WO_cpi_index(df):
    return json.dumps((interest(df), interest_by_bank(df)))


def variable_W_cpi_index(df):
    return json.dumps((interest(df), interest_by_bank(df)))


def interest(df):
    keys = ["label", "jsId", "backgroundColor", "pointRadius", "data"]
    label = ["עד 45% מימון", "בין 45% ל- 60% מימון", "מעל 60% מימון"]
    jsId = ["LTV45", "LTV45-60", "LTV60"]
    ltv_strings = ["LTV <= 45%", "45% <= LTV <= 60%", "LTV>=60 [%]"]
    ltv_tooltip = ["עד 45% מימון", "בין 45% ל- 60% מימון", "מעל 60% מימון"]
    ltv_levels = len(label)
    backgroundColor = operator.itemgetter(5, 4, 0)(color_palette)
    # pointStyle = ['circle', 'triangle', 'rectRot']
    # borderColor = ['#34D899', '#FFCA19', '#FF9465']
    pointRadius = [7 for _ in range(ltv_levels)]
    dicts = [dict.fromkeys(keys, None) for _ in range(ltv_levels)]

    for ltv_idx, (ltv_string, d) in enumerate(zip(ltv_strings, dicts), 1):
        curr_points = df[df["LTV"] == ltv_string]
        data = [
            {
                "x": int(data_point[1]["Years"]),
                "y": data_point[1]["Interest_rate"],
                "bank": data_point[1]["Bank_name"],
                "ltv": ltv_string,
                "ltv_tooltip": ltv_tooltip[ltv_strings.index(data_point[1]["LTV"])],
            }
            for data_point in curr_points.iterrows()
        ]
        for key in keys:
            if key != "data":
                d[key] = locals()[key][ltv_idx - 1]
            else:
                d[key] = data
    df_as_json = json.dumps(dicts)
    return df_as_json


def interest_by_bank(df):
    keys = ["label", "jsId", "backgroundColor", "pointRadius", "data"]
    label = ["הבינלאומי", "מזרחי-טפחות", "דיסקונט", "לאומי", "פועלים", "אגוד"]
    ltv_tooltip = ["עד 45% מימון", "בין 45% ל- 60% מימון", "מעל 60% מימון"]
    ltv_strings = ["LTV <= 45%", "45% <= LTV <= 60%", "LTV>=60 [%]"]
    ltv_id = ["LTV45", "LTV45-60", "LTV60"]
    jsId = label
    number_of_banks = len(label)
    backgroundColor = operator.itemgetter(4, 3, 5, 8, 0, 9)(color_palette)
    # pointStyle = ['circle', 'triangle', 'rectRot']
    # borderColor = ['#34D899', '#FFCA19', '#FF9465']
    pointRadius = [7 for _ in range(number_of_banks)]
    dicts = [dict.fromkeys(keys, None) for _ in range(number_of_banks)]

    for bank_idx, (lbl, d) in enumerate(zip(label, dicts), 1):
        curr_points = df[df["Bank_name"] == lbl]
        data = [
            {
                "x": int(data_point[1]["Years"]),
                "y": data_point[1]["Interest_rate"],
                "bank": lbl,
                "ltv": ltv_id[ltv_strings.index(data_point[1]["LTV"])],
                "ltv_tooltip": ltv_tooltip[ltv_strings.index(data_point[1]["LTV"])],
            }
            for data_point in curr_points.iterrows()
        ]
        for key in keys:
            if key != "data":
                d[key] = locals()[key][bank_idx - 1]
            else:
                d[key] = data
    df_as_json = json.dumps(dicts)
    return df_as_json


# ####################### 2: analytics routes #######################


def loan_cost_as_function_of_monthly_payment(df):
    config = {
        "label": ["עד 1.25", "עד 1.5", "עד 1.75", "עד 2", "מעל 2"],
        "header": "עלות לשקל בודד [ש״ח]",
        "col_header": "danger",
    }
    return analytics(df, config)


def change_in_monthly_return_as_function_of_first_payment(df):
    config = {
        "label": ["עד 10%", "עד 20%", "עד 30%", "עד 40%", "מעל 40%"],
        "header": "זינוק מקסימלי חזוי בהחזר החודשי",
        "col_header": "danger",
    }
    return analytics(df, config)


def Principal_halved_function_of_monthly_payment(df):
    config = {
        "label": [
            "עד 5 שנים",
            "בין 5 ל- 10 שנים",
            "בין 10 ל- 15 שנים",
            "בין 15 ל- 20 שנים",
            "מעל 20 שנים",
        ],
        "header": "מתי הקרן תרד במחצית - כתלות בגודלה ובהחזר החודשי (הראשוני)",
        "col_header": "Time",
    }
    return analytics(df, config)


def analytics(df, config):
    keys = ["label", "header", "backgroundColor", "pointRadius", "data"]
    label = config["label"]
    danger_levels = len(label)
    header = [config["header"] for _ in range(danger_levels)]
    backgroundColor = operator.itemgetter(7, 5, 4, 2, 0)(color_palette)
    # borderColor = ['#34D899', '#B9DE7F', '#FFCA19', '#FE9E69', '#FF9465']
    pointRadius = [7 for _ in range(danger_levels)]
    dicts = [dict.fromkeys(keys, None) for _ in range(danger_levels)]

    for danger_idx, d in enumerate(dicts, 1):
        curr_points = df[df[config["col_header"]] == danger_idx]
        data = [
            {
                "x": data_point[1]["mortgage_size"].item(),
                "y": data_point[1]["monthly_payment"].item(),
                "danger": data_point[1][config["col_header"]].item(),
            }
            for data_point in curr_points.iterrows()
        ]
        for key in keys:
            if key != "data":
                d[key] = locals()[key][danger_idx - 1]
            else:
                d[key] = data
    df_as_json = json.dumps(dicts)
    return df_as_json


# ####################### 3: economic expectations routes #######################


def InterestFile(df, sheet):
    if sheet["plot_type"] == "Line":
        data = [{"x": i / 12, "y": point * 100} for i, point in enumerate(df["values"])]
        dicts = [
            {
                "data": data,
                "pointRadius": 5,
                "fill": False,
                "borderColor": "rgba(255, 202, 25, 1)",
                "backgroundColor": "rgba(255, 202, 25, 1)",
                "name": sheet["name"],
            }
        ]
    else:
        dicts = [x * 100 for x in df["values"]]
    df_as_json = json.dumps(dicts)
    return df_as_json


# ####################### 4: interest level routes #######################


def real_historical(df):
    config = {
        "label": [
            "שנה",
            "שנתיים",
            "3 שנים",
            "4 שנים",
            "5 שנים",
            "7 שנים",
            "10 שנים",
            "20 שנים",
        ],
        "header": "ריבית ריאלית",
    }
    return historical_interest(df, config)


def nominal_historical(df):
    config = {
        "label": [
            "שנה",
            "שנתיים",
            "3 שנים",
            "4 שנים",
            "5 שנים",
            "7 שנים",
            "10 שנים",
            "15 שנים",
        ],
        "header": "ריבית נומינלית",
    }
    return historical_interest(df, config)


def historical_interest(df, config):
    keys = [
        "label",
        "header",
        "backgroundColor",
        "borderColor",
        "pointRadius",
        "fill",
        "data",
    ]
    label = config["label"]
    years = len(label)
    header = [config["header"] for _ in range(years)]
    backgroundColor = color_palette[7::-1]
    borderColor = backgroundColor
    pointRadius = [2 for _ in range(years)]
    fill = [False for _ in range(years)]
    dicts = [dict.fromkeys(keys, None) for _ in range(years)]

    times = df.iloc[1:, 0]
    for years_idx, d in enumerate(dicts, 1):
        curr_points = df.iloc[1:, years_idx]
        data = [
            {
                "x": data_point[1].strftime("%m-%Y"),
                "y": t[1],
            }  # strftime('%Y-%m-%dT%H:%M:%SZ')} #.strftime('%m-%Y')}
            for data_point, t in zip(times.iteritems(), curr_points.iteritems())
        ]
        for key in keys:
            if key != "data":
                d[key] = locals()[key][years_idx - 1]
            else:
                d[key] = data
    df_as_json = json.dumps(dicts)
    return df_as_json


def excel_to_data_sets():
    logging.info("converting csv and xlsx files to json...")
    excel_files = [
        f
        for f in EXCEL_FILES_DIR.iterdir()
        if f.is_file() and not f.stem.startswith(".") and not f.stem.startswith("~")
    ]

    for excel_file in excel_files:
        file_full_path = pathlib.Path(EXCEL_FILES_DIR, excel_file)
        if excel_file.stem != "InterestFile":
            with open(file_full_path, "rb") as f:
                result = chardet.detect(f.read())

            if excel_file.suffix == ".csv":
                df = pd.read_csv(file_full_path, encoding=result["encoding"])
            elif excel_file.suffix == ".xlsx" or excel_file.suffix == ".xls":
                df = pd.read_excel(file_full_path)

            try:
                df_as_json = globals()[excel_file.stem](df)
            except KeyError:
                logging.error(f"failed to convert {excel_file}")
                continue

            file_json = excel_file.stem + ".json"
            with open(pathlib.Path(JSON_FILES_DIR, file_json), "w") as f:
                f.write(df_as_json)

        if excel_file.stem == "InterestFile":
            sheets = [
                {
                    "name": "Prime",
                    "plot_type": "Line",
                    "col": "B",
                    "cell_range": [3, 362],
                },
                {
                    "name": "Inflation",
                    "plot_type": "Line",
                    "col": "B",
                    "cell_range": [3, 362],
                },
                {
                    "name": "Variable WO CPI",
                    "plot_type": "Bar",
                    "col": "B",
                    "cell_range": [3, 8],
                },
                {
                    "name": "Variable W CPI",
                    "plot_type": "Bar",
                    "col": "B",
                    "cell_range": [3, 8],
                },
            ]
            for sheet in sheets:
                df = pd.read_excel(
                    file_full_path,
                    sheet_name=sheet["name"],
                    skiprows=sheet["cell_range"][0] - 1,
                    nrows=sheet["cell_range"][1] - sheet["cell_range"][0] + 1,
                    usecols=sheet["col"],
                    header=None,
                )
                df.columns = ["values"]
                df_as_json = InterestFile(df, sheet)
                file_json = (
                    excel_file.stem + "_" + sheet["name"].replace(" ", "_") + ".json"
                )
                with open(pathlib.Path(JSON_FILES_DIR, file_json), "w") as f:
                    f.write(df_as_json)

    logging.info("successfully converted csv and xlsx files to json")


if __name__ == "__main__":
    excel_to_data_sets()
