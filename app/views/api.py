from flask import Blueprint, jsonify, request
from flask_login import current_user
from app.controllers import json_api, filter_loader

bp_api = Blueprint('api', __name__)

def json_error(err_str):
    return jsonify(error=True, err_str=err_str)

@bp_api.route('/historical', methods=['GET'])
@json_api
def historical():
    return 'historical'

@bp_api.route('/get/filter', methods=['POST'])
def filter_repository():
    if current_user.role not in ('unregistered', 'registered', 'paid_user'):
        return json_error(f"Unsupported user role: {current_user.role}")

    if 'filter' not in request.json:
        return json_error('filter not specified')

    filter_script = filter_loader.get_filter(request.json['filter'])
    if filter_script is None:
        return json_error(f"Unsupported filter: {request.json['filter']}")

    return jsonify(error=False, data=filter_script)