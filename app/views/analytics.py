import json
from flask import Blueprint, render_template

bp_analytics = Blueprint('analytics', __name__)


@bp_analytics.route("/analytics")
def analytics():
    with open('./static/json_files/change_in_monthly_return_as_function_of_first_payment.json') as f_change_monthly, \
            open('./static/json_files/loan_cost_as_function_of_monthly_payment.json') as f_loan_cost, \
            open('./static/json_files/Principal_halved_function_of_monthly_payment.json') as f_principal_halved:
        data_set_change_monthly = json.load(f_change_monthly)
        data_set_loan_cost = json.load(f_loan_cost)
        data_set_principal_halved = json.load(f_principal_halved)

    data_set = {
        'change_monthly': data_set_change_monthly,
        'loan_cost': data_set_loan_cost,
        'principal_halved': data_set_principal_halved,
    }

    return render_template('home.html', data_set=data_set, filter_form='analytics')
