import json
from flask import Blueprint, render_template
from app.controllers import json_handler

bp_analytics = Blueprint('analytics', __name__)


@bp_analytics.route("/analytics")
def analytics():
    data_set = {
        'change_monthly': json_handler.get('change_in_monthly_return_as_function_of_first_payment'),
        'loan_cost': json_handler.get('loan_cost_as_function_of_monthly_payment'),
        'principal_halved': json_handler.get('Principal_halved_function_of_monthly_payment'),
    }

    return render_template('home.html', data_set=data_set, filter_form='analytics')
