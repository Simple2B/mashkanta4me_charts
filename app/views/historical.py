import json
from flask import Blueprint, render_template
from flask_login import current_user
from app.controllers import json_handler

bp_historical = Blueprint('historical', __name__)

@bp_historical.route("/historical")
def historical():
    return render_template('historical.html', role=current_user.role)
