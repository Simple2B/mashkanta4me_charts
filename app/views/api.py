import json
from flask import Blueprint, jsonify, request
from app.controllers import ChartDataSource


bp_api = Blueprint('api', __name__)


@bp_api.route("/data/<string:chart_name>")
def get_chart_data(chart_name: str):
    query_string = request.args.get('q')
    options = {}
    if query_string:
        options = json.loads(query_string)

    data_source = ChartDataSource()
    data = data_source.chart_data(chart_name=chart_name, options=options)
    return jsonify(data)
