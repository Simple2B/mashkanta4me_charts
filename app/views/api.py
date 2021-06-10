import json
from flask import Blueprint, jsonify, request
from flask_login import current_user, login_user
from app.controllers import ChartDataSource
from app import db
from app.models import WpAuthKey, User


bp_api = Blueprint('api', __name__)


@bp_api.route("/data/<string:chart_name>")
def get_chart_data(chart_name: str):
    query_string = request.args.get('q')
    options = {}
    if query_string:
        options = json.loads(query_string)

    data_source = ChartDataSource()
    data = data_source.chart_data(chart_name=chart_name, options=options)
    return jsonify(data)


def get_wp_auth_role(key_id, uuid):
    auth_key = WpAuthKey.query.filter(WpAuthKey.id == key_id).first()
    if auth_key is not None and auth_key.uuid == uuid:
        db.session.delete(auth_key)
        db.session.commit()
        return auth_key.role
    return None


@bp_api.route("/auth/proxy_key", methods=["POST"])
def auth_by_proxy_key():
    proxy_key = request.json
    role = get_wp_auth_role(proxy_key["key_id"], proxy_key["uuid"])

    if role:
        if current_user.is_authenticated:
            user = User.query.get(int(current_user.get_id()))
            user.role = role
            user.save()

        else:
            user = User(role=role)
            user.save()
            login_user(user)

    return jsonify({"error": False, "msg": "new role is set"})
