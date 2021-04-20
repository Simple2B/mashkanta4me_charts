from flask import Blueprint, render_template
from flask_login import current_user

from config import BaseConfig as conf

bp_analytics = Blueprint('analytics', __name__)


@bp_analytics.route("/analytics")
def analytics():
    return render_template('analytics_index.html', role=current_user.role, app_root=conf.APP_ROOT)
