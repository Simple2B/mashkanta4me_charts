import json
from flask import Blueprint, render_template

bp_historical = Blueprint('historical', __name__)


@bp_historical.route("/historical")
def historical():
    with open('./static/json_files/real_historical.json') as f_real, \
            open('./static/json_files/nominal_historical.json') as f_nominal:

        data_set = {
            'real': json.load(f_real),
            'nominal': json.load(f_nominal),
        }

    return render_template('home.html', data_set=data_set, filter_form='historical')
