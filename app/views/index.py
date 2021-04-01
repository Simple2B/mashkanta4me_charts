import json
from flask import Blueprint, render_template, url_for, request, app, redirect
from flask_login import current_user, logout_user


bp_index = Blueprint('index', __name__)
DASHBOARD_ENDPOINTS = (
    'economic_expect.InterestFile_Variable_WO_CPI',
    'economic_expect.InterestFile_Variable_W_CPI',
    'economic_expect.InterestFile_Inflation',
    'interest.constant_WO_cpi_index',
    'interest.variable_WO_cpi_index',
    'interest.constant_W_cpi_index',
    'interest.variable_W_cpi_index',
    'economic_expect.InterestFile_Prime',
    'interest.eligibility',
    'interest.prime_index',
    'historical.historical',
    'analytics.analytics',
)


@bp_index.route("/")
def home():
    return render_template("sitemap.html", data=DASHBOARD_ENDPOINTS)


@bp_index.route("/admin", methods=['GET'])
def admin():
    password_error_message = request.args.get('password_error_message')
    if password_error_message is None:
        password_error_message = ''
    return render_template('admin_login.html', password_error_message=password_error_message)


@bp_index.route("/update_data", methods=['POST', 'GET'])
def update_data_route():
    password = request.form.get('password').encode("utf-8")
    # hashed = bcrypt.hashpw(password, bcrypt.gensalt()) # generate hash for Eyal's password
    if bcrypt.checkpw(password, b'$2b$12$PNi9fGQ0RqrnzzkOtXOOiufg04u.UympdSXYKH3Q7JoTT/dazaLiW'):
        update_data()
        return render_template('update_data_success.html')
    else:
        return flask.redirect(url_for('admin', password_error_message='wrong password'))

# TODO remove in future
@bp_index.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('historical.historical'))