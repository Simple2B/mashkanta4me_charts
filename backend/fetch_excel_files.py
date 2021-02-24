import os
import logging

import requests
from bs4 import BeautifulSoup

from backend.configurations import EXCEL_FILES_DIR, STATISTICS_DATABASE_URL

logging.basicConfig(format='[ %(asctime)s ] [ %(levelname)s ] - %(message)s', level=logging.INFO)


def list_files_on_server(url, ext):
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')
    return [node.get('href') for node in soup.find_all('a')
            if node.get('href').endswith(ext)]


def fetch_excel_files(statistics_database):
    logging.info('downloading csv, xlsx and xls files...')
    ext = ('.csv', '.xlsx', '.xls')
    files = list_files_on_server(url=statistics_database, ext=ext)
    for file in files:
        res = requests.get(statistics_database + '/' + file)
        with open(os.path.join(EXCEL_FILES_DIR, file), 'wb') as f:
            f.write(res.content)

    logging.info('successfully downloaded csv and xlsx files')


if __name__ == '__main__':
    fetch_excel_files(statistics_database=STATISTICS_DATABASE_URL)
