from flask import Blueprint, render_template
from app.controllers import json_handler

bp_interest = Blueprint("interest", __name__)


@bp_interest.route("/constant_WO_cpi_index")
def constant_WO_cpi_index():
    return render_template(
        "home.html",
        data_set=json_handler.get("constant_WO_cpi_index"),
        filter_form="interest",
    )


@bp_interest.route("/constant_W_cpi_index")
def constant_W_cpi_index():
    return render_template(
        "home.html",
        data_set=json_handler.get("constant_W_cpi_index"),
        filter_form="interest",
    )


@bp_interest.route("/eligibility")
def eligibility():
    return render_template(
        "home.html", data_set=json_handler.get("eligibility"), filter_form="interest"
    )


@bp_interest.route("/prime_index")
def prime_index():
    return render_template(
        "home.html", data_set=json_handler.get("prime_index"), filter_form="interest"
    )


@bp_interest.route("/variable_WO_cpi_index")
def variable_WO_cpi_index():
    return render_template(
        "home.html",
        data_set=json_handler.get("variable_WO_cpi_index"),
        filter_form="interest",
    )


@bp_interest.route("/variable_W_cpi_index")
def variable_W_cpi_index():
    return render_template(
        "home.html",
        data_set=json_handler.get("variable_W_cpi_index"),
        filter_form="interest",
    )
