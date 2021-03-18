import json
from flask import Blueprint, render_template
from app.controllers import json_handler

bp_historical = Blueprint('historical', __name__)


@bp_historical.route("/historical")
def historical():
    data_set = {
        'real': json_handler.get('real_historical'),
        'nominal': json_handler.get('nominal_historical'),
    }

    return render_template('home.html', data_set=data_set, filter_form='historical')
