from flask import (
    Blueprint,
    render_template,
    url_for,
    request,
    redirect,
    Response,
    abort,
)
from flask_login import logout_user, login_required, current_user
from app.controllers import ChartDataSource
from config import BaseConfig as base_config

bp_index = Blueprint("index", __name__)
DASHBOARD_ENDPOINTS = (
    "economic_expect.InterestFile_Variable_WO_CPI",
    "economic_expect.InterestFile_Variable_W_CPI",
    "economic_expect.InterestFile_Inflation",
    "interest.constant_WO_cpi_index",
    "interest.variable_WO_cpi_index",
    "interest.constant_W_cpi_index",
    "interest.variable_W_cpi_index",
    "economic_expect.InterestFile_Prime",
    "interest.eligibility",
    "interest.prime_index",
    "historical.historical",
    "analytics.analytics",
)


@bp_index.route("/")
def home():
    return render_template("sitemap.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/dashboard1")
def prime_dashboard1():
    return render_template("dashboard1.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/dashboard2")
def prime_dashboard2():
    return render_template("dashboard2.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/dashboard3")
def prime_dashboard3():
    return render_template("dashboard3.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/dashboard4")
def prime_dashboard4():
    return render_template("dashboard4.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/dashboard5")
def prime_dashboard5():
    return render_template("dashboard5.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/dashboard6")
def prime_dashboard6():
    return render_template("dashboard6.html", role=current_user.role, app_root=base_config.APP_ROOT)


@bp_index.route("/admin", methods=["GET"])
def admin():
    password_error_message = request.args.get("password_error_message")
    if password_error_message is None:
        password_error_message = ""
    return render_template(
        "admin_login.html", password_error_message=password_error_message
    )


@bp_index.route("/update_data", methods=["POST", "GET"])
@login_required
def update_data_route():
    if current_user.role == "administrator":
        data_source = ChartDataSource()
        data_source.update()
        return render_template("update_data_success.html")
    abort(Response("Access denied"))


# TODO remove in future
@bp_index.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("historical.historical"))


@bp_index.route("/login")
def login():
    if not current_user.is_authenticated:
        return render_template("login.html", role="unregistered")
    return redirect(url_for("historical.historical"))
