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
    "variable_wo": "VARIABLE_WO_CPI.csv"
}

DATA_DIR_NAME = 'data'
EXCEL_FILES_DIR_NAME = 'excel_files'

DATA_DIR = pathlib.Path(BASE_DIR, DATA_DIR_NAME)
EXCEL_FILES_DIR = pathlib.Path(DATA_DIR, EXCEL_FILES_DIR_NAME)

EXCEL_FILES_DIR.mkdir(parents=True, exist_ok=True)


class ChartDataSource(object):
    def __init__(self) -> None:
        super().__init__()

    def update(self) -> None:
        log(log.INFO, "Update file from [%s]", conf.STATISTICS_DATABASE_URL)
        for file_name in DATASET_MAP_JSON.values():
            url = urllib.parse.urljoin(conf.STATISTICS_DATABASE_URL, file_name)
            log(log.INFO, "Download [%s] from [%s]", file_name, url)
            res = requests.get(url)
            with open(pathlib.Path(EXCEL_FILES_DIR) / file_name, 'wb') as f:
                f.write(res.content)

    @property
    def charts(self):
        return DATASET_MAP_JSON.keys()

    def chart_data(self, chart_name: str) -> dict:
        if chart_name not in DATASET_MAP_JSON:
            log(log.WARNING, "Asked unknown chart_name: [%s]", chart_name)
            return {}
        file_name = DATASET_MAP_JSON[chart_name]
        with open(pathlib.Path(EXCEL_FILES_DIR) / file_name, "r", encoding="cp862") as file:
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
