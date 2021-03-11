import json
from flask import Blueprint, render_template

bp_interest = Blueprint('interest', __name__)


@bp_interest.route("/constant_WO_cpi_index")
def constant_WO_cpi_index():
    with open('./static/json_files/constant_WO_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@bp_interest.route("/constant_W_cpi_index")
def constant_W_cpi_index():
    with open('./static/json_files/constant_W_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@bp_interest.route("/eligibility")
def eligibility():
    with open('./static/json_files/eligibility.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@bp_interest.route("/prime_index")
def prime_index():
    with open('./static/json_files/prime_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@bp_interest.route("/variable_WO_cpi_index")
def variable_WO_cpi_index():
    with open('./static/json_files/variable_WO_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@bp_interest.route("/variable_W_cpi_index")
def variable_W_cpi_index():
    with open('./static/json_files/variable_W_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')
