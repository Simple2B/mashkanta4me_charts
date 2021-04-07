from flask import Blueprint, render_template
from app.controllers import json_handler

bp_economic_expect = Blueprint("economic_expect", __name__)


@bp_economic_expect.route("/InterestFile_Prime")
def InterestFile_Prime():
    return render_template(
        "home.html",
        data_set=json_handler.get("InterestFile_Prime"),
        filter_form="economic_expectations_line",
    )


@bp_economic_expect.route("/InterestFile_Inflation")
def InterestFile_Inflation():
    return render_template(
        "home.html",
        data_set=json_handler.get("InterestFile_Inflation"),
        filter_form="economic_expectations_line",
    )


@bp_economic_expect.route("/InterestFile_Variable_W_CPI")
def InterestFile_Variable_W_CPI():
    return render_template(
        "home.html",
        data_set=json_handler.get("InterestFile_Variable_W_CPI"),
        filter_form="economic_expectations_bar",
    )


@bp_economic_expect.route("/InterestFile_Variable_WO_CPI")
def InterestFile_Variable_WO_CPI():
    return render_template(
        "home.html",
        data_set=json_handler.get("InterestFile_Variable_WO_CPI"),
        filter_form="economic_expectations_bar",
    )
