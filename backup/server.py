import json

import bcrypt
from flask import Flask, render_template, url_for, request
import flask

from backend.task import update_data

# update_data()
app = Flask(__name__)

# if app.config["DEBUG"]:
@app.after_request
def after_request(response):
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate, public, max-age=0"
    response.headers["Expires"] = 0
    response.headers["Pragma"] = "no-cache"
    return response


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


# ####################### 0: general non plot routes #######################

@app.route("/")
def home():
    links = []
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and has_no_empty_params(rule):
            url = url_for(rule.endpoint, **(rule.defaults or {}))
            if rule.endpoint != 'home' and rule.endpoint != 'update_data_route'\
                    and rule.endpoint != 'admin':
                links.append((url, rule.endpoint))
    return render_template("sitemap.html", data=links)


@app.route("/admin", methods=['GET'])
def admin():
    password_error_message = request.args.get('password_error_message')
    if password_error_message is None:
        password_error_message = ''
    return render_template('admin_login.html', password_error_message=password_error_message)


@app.route("/update_data", methods=['POST', 'GET'])
def update_data_route():
    password = request.form.get('password').encode("utf-8")
    # hashed = bcrypt.hashpw(password, bcrypt.gensalt()) # generate hash for Eyal's password
    if bcrypt.checkpw(password, b'$2b$12$PNi9fGQ0RqrnzzkOtXOOiufg04u.UympdSXYKH3Q7JoTT/dazaLiW'):
        update_data()
        return render_template('update_data_success.html')
    else:
        return flask.redirect(url_for('admin', password_error_message='wrong password'))


# ####################### 1: interest routes #######################

@app.route("/constant_WO_cpi_index")
def constant_WO_cpi_index():
    with open('./static/json_files/constant_WO_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@app.route("/constant_W_cpi_index")
def constant_W_cpi_index():
    with open('./static/json_files/constant_W_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@app.route("/eligibility")
def eligibility():
    with open('./static/json_files/eligibility.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@app.route("/prime_index")
def prime_index():
    with open('./static/json_files/prime_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@app.route("/variable_WO_cpi_index")
def variable_WO_cpi_index():
    with open('./static/json_files/variable_WO_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


@app.route("/variable_W_cpi_index")
def variable_W_cpi_index():
    with open('./static/json_files/variable_W_cpi_index.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='interest')


# ####################### 2: analytics routes #######################


@app.route("/analytics")
def analytics():
    with open('./static/json_files/change_in_monthly_return_as_function_of_first_payment.json') as f_change_monthly, \
            open('./static/json_files/loan_cost_as_function_of_monthly_payment.json') as f_loan_cost, \
            open('./static/json_files/Principal_halved_function_of_monthly_payment.json') as f_principal_halved:
        data_set_change_monthly = json.load(f_change_monthly)
        data_set_loan_cost = json.load(f_loan_cost)
        data_set_principal_halved = json.load(f_principal_halved)
    return render_template('home.html', data_set={'change_monthly': data_set_change_monthly,
                                                  'loan_cost': data_set_loan_cost,
                                                  'principal_halved': data_set_principal_halved
                                                  }, filter_form='analytics')


# ####################### 3: economic expectations routes #######################

@app.route("/InterestFile_Prime")
def InterestFile_Prime():
    with open('./static/json_files/InterestFile_Prime.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_line')


@app.route("/InterestFile_Inflation")
def InterestFile_Inflation():
    with open('./static/json_files/InterestFile_Inflation.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_line')


@app.route("/InterestFile_Variable_W_CPI")
def InterestFile_Variable_W_CPI():
    with open('./static/json_files/InterestFile_Variable_W_CPI.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_bar')


@app.route("/InterestFile_Variable_WO_CPI")
def InterestFile_Variable_WO_CPI():
    with open('./static/json_files/InterestFile_Variable_WO_CPI.json') as f:
        data_set = json.load(f)
    return render_template('home.html', data_set=data_set, filter_form='economic_expectations_bar')


# ####################### 4: interest level routes #######################

@app.route("/historical")
def historical():
    with open('./static/json_files/real_historical.json') as f_real, \
            open('./static/json_files/nominal_historical.json') as f_nominal:
        data_set_real = json.load(f_real)
        data_set_nominal = json.load(f_nominal)
    return render_template('home.html', data_set={'real': data_set_real, 'nominal': data_set_nominal}, filter_form='historical')


if __name__ == "__main__":
    app.run(debug=True, use_reloader=True, host='0.0.0.0')
