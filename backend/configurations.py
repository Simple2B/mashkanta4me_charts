import pathlib

STATISTICS_DATABASE_URL = r'https://www.mashkanta4.me/wp-content/uploads/statistics_database/'

PROJECT_BASE = pathlib.Path(__file__).resolve().parents[1]
BACKEND_DIR = pathlib.Path(__file__).resolve().parents[0]

DATA_DIR_NAME = 'data'
STATIC_DIR_NAME = 'static'
EXCEL_FILES_DIR_NAME = 'excel_files'
JSON_FILES_DIR_NAME = 'json_files'

STATIC_DIR = pathlib.Path(PROJECT_BASE, STATIC_DIR_NAME)
DATA_DIR = pathlib.Path(PROJECT_BASE, DATA_DIR_NAME)
EXCEL_FILES_DIR = pathlib.Path(DATA_DIR, EXCEL_FILES_DIR_NAME)
JSON_FILES_DIR = pathlib.Path(STATIC_DIR_NAME, JSON_FILES_DIR_NAME)

EXCEL_FILES_DIR.mkdir(parents=True, exist_ok=True)
JSON_FILES_DIR.mkdir(parents=True, exist_ok=True)
