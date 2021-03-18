import json
from pathlib import Path
from flask import url_for


class JsonHandler:
    def __init__(self, dir_name):
        self.json_dir = Path('./app/static/') / dir_name

    def get(self, f_name):
        try:
            full_path = self.json_dir.resolve() / (f_name + '.json')
            with open(full_path) as json_file:
                return json.load(json_file)
        except FileNotFoundError:
            return None

json_handler = JsonHandler('json_files')