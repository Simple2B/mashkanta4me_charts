from flask import Blueprint, jsonify
from app.controllers import ChartDataSource

bp_api = Blueprint('api', __name__)


@bp_api.route("/data/<string:chart_name>")
def get_chart_data(chart_name: str):
    data_source = ChartDataSource()
    data = data_source.chart_data(chart_name=chart_name)
    return jsonify(data)
