import os

from flask import Flask, abort
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from werkzeug.exceptions import HTTPException

# instantiate extensions
login_manager = LoginManager()
db = SQLAlchemy()


class AppWithRoot(Flask):
    def __init__(self, name):
        super().__init__(name)

    def __call__(self, environ, start_response):
        environ['SCRIPT_NAME'] = os.environ.get('APP_ROOT', '')
        return super().__call__(environ, start_response)


def create_app(environment='development'):
    from config import config
    from app.views import (
        bp_interest,
        bp_analytics,
        bp_economic_expect,
        bp_historical,
        bp_index,
    )

    from app.models import (
        User,
        AnonymousUser,
    )

    # Instantiate app.
    app = AppWithRoot(__name__)

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
    app.register_blueprint(bp_index)

    # Set up flask login.
    @login_manager.user_loader
    def get_user(id):
        return User.query.get(int(id))

    login_manager.login_view = 'auth.login'
    login_manager.login_message_category = 'info'
    login_manager.anonymous_user = AnonymousUser

    return app
