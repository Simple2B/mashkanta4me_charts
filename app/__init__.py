import os
import json
from urllib.parse import unquote

from flask import Flask, abort, request, Response, session
from flask_login import LoginManager, current_user, login_user
from werkzeug.exceptions import HTTPException
from app.models import db, AnonUser, User, WpAuthKey
from config import config
from app.views import (
    bp_interest,
    bp_analytics,
    bp_economic_expect,
    bp_historical,
    bp_api,
    bp_index,
)
from flask_cors import CORS

# instantiate extensions
login_manager = LoginManager()


class AppWithRoot(Flask):
    def __call__(self, environ, start_response):
        #environ['SCRIPT_NAME'] = os.environ.get('APP_ROOT', '')
        return super().__call__(environ, start_response)


def create_app(environment='development'):
    # Instantiate app.
    app = AppWithRoot(__name__)
    CORS(app)

    # Set app config.
    env = os.environ.get('FLASK_ENV', environment)
    app.config.from_object(config[env])
    config[env].configure(app)

    # Set up extensions.
    db.init_app(app)
    login_manager.init_app(app)

    # Register blueprints.
    app.register_blueprint(bp_interest)
    app.register_blueprint(bp_analytics)
    app.register_blueprint(bp_economic_expect)
    app.register_blueprint(bp_historical)
    app.register_blueprint(bp_api, url_prefix="/api")
    app.register_blueprint(bp_index)

    # Set up flask login.
    def retrieve_wp_cookies():
        data = request.cookies.get('wp_auth')
        if data is None:
            return None

        data = unquote(data)
        return json.loads(data)

    def get_wp_auth_role(key_id, uuid):
        auth_key = WpAuthKey.query.filter(WpAuthKey.id == key_id).first()
        if auth_key is not None and auth_key.uuid == uuid:
            db.session.delete(auth_key)
            db.session.commit()
            return auth_key.role

        return None

    def get_new_role():
        data = retrieve_wp_cookies()
        if data is None:
            return None

        return get_wp_auth_role(data['key_id'], data['uuid'])

    @login_manager.user_loader
    def get_user(id):
        user = User.query.get(int(id))
        new_role = get_new_role()
        if new_role is not None:
            user.role = new_role
            user.save()

        return user

    # read from uuid and other data
    @login_manager.request_loader
    def wp_cookie_handler(request):
        new_role = get_new_role()
        if new_role is None:
            return AnonUser()

        user = User(role=new_role)
        user.save()
        login_user(user)
        return user

    login_manager.anonymous_user = AnonUser
    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'

    return app