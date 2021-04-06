from flask import Blueprint, render_template
from flask_login import current_user

bp_analytics = Blueprint('analytics', __name__)


@bp_analytics.route("/analytics")
def analytics():
    return render_template('analytics.html', role=current_user.role)
