import json
from flask import Blueprint, render_template

bp_economic_expect = Blueprint('economic_expect', __name__)


@bp_economic_expect.route("/InterestFile_Prime")
def InterestFile_Prime():
    with open('./static/json_files/InterestFile_Prime.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_line')


@bp_economic_expect.route("/InterestFile_Inflation")
def InterestFile_Inflation():
    with open('./static/json_files/InterestFile_Inflation.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_line')


@bp_economic_expect.route("/InterestFile_Variable_W_CPI")
def InterestFile_Variable_W_CPI():
    with open('./static/json_files/InterestFile_Variable_W_CPI.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_bar')


@bp_economic_expect.route("/InterestFile_Variable_WO_CPI")
def InterestFile_Variable_WO_CPI():
    with open('./static/json_files/InterestFile_Variable_WO_CPI.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_bar')
