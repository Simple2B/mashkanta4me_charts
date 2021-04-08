import pytest
from app import create_app

JSON_FILES = (
    'InterestFile_Inflation',
    'InterestFile_Prime',
    'InterestFile_Variable_WO_CPI',
    'InterestFile_Variable_W_CPI',
    'Principal_halved_function_of_monthly_payment',
    'change_in_monthly_return_as_function_of_first_payment',
    'constant_WO_cpi_index',
    'constant_W_cpi_index',
    'eligibility',
    'loan_cost_as_function_of_monthly_payment',
    'nominal_historical',
    'nominal_zero',
    'prime_index',
    'real_historical',
    'real_zero',
    'variable_WO_cpi_index',
    'variable_W_cpi_index',
)


@pytest.fixture
def client():
    app = create_app(environment="testing")
    app.config["TESTING"] = True
    app.config['SERVER_NAME'] = 'localhost.localdomain'

    with app.test_client() as client:
        app_ctx = app.app_context()
        app_ctx.push()
        yield client
        app_ctx.pop()


def test_json_files(client):
    from app.controllers import json_handler

    for json_name in JSON_FILES:
        json_payload = json_handler.get(json_name)

        assert json_payload is not None


def test_test(client):
    res = client.get("/")
    assert res
