import json
from pathlib import Path
from flask import jsonify


DATASET_MAP_JSON = {
    'historical': {
        'real': 'real_historical',
        'nominal': 'nominal_historical'
    },

    'analytics': {
        'change_monthly': 'change_in_monthly_return_as_function_of_first_payment',
        'loan_cost': 'loan_cost_as_function_of_monthly_payment',
        'principal_halved': 'Principal_halved_function_of_monthly_payment',
    }
}


class JsonHandler:
    def __init__(self, dir_name):
        self.json_dir = Path('./app/static/') / dir_name
        self.json_dir = self.json_dir.resolve()

    def get(self, dataset_name):
        file_request = DATASET_MAP_JSON.get(dataset_name, '')
        if not file_request:
            return {
                'error': True,
                'err_str': f"No dataset with name: {dataset_name}"
            }

        dataset = {}
        for data_name, json_file in file_request.items():
            full_path = self.json_dir / (json_file + '.json')
            with open(full_path) as json_file:
                json_data = json.load(json_file)
                dataset[data_name] = json_data

        return {
            'error': False,
            'data': dataset,
        }


def json_api(route_handler):
    def route_wrapper():
        dataset_name = route_handler()
        dataset = json_handler.get(dataset_name)
        if dataset is None:
            return jsonify(dict(error=True, err_str="No dataset with name: {}".format(dataset_name)))
        return jsonify(dict(error=False, data=dataset))

    return route_wrapper


json_handler = JsonHandler('json_files')
