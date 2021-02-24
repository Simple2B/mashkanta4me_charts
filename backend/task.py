import logging
import sys

import requests

from backend.fetch_excel_files import fetch_excel_files
from backend.excel_to_data_sets import excel_to_data_sets
from backend.configurations import STATISTICS_DATABASE_URL

logging.basicConfig(format='[ %(asctime)s ] [ %(levelname)s ] - %(message)s', level=logging.INFO)
logging.info('updating data...')


def update_data():
    try:
        fetch_excel_files(statistics_database=STATISTICS_DATABASE_URL)
    except requests.exceptions.RequestException as e:
        logging.error(f'failed to fetch excel files, reason: {e}')
        sys.exit(1)

    try:
        excel_to_data_sets()
    except Exception as e:
        logging.error(f'failed to convert excel files to json, reason: {e}')
        sys.exit(1)


if __name__ == '__main__':
    update_data()
