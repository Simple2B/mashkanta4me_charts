from flask_login import AnonymousUserMixin, UserMixin
from app.models.wp_auth import WpAuthKey
from app.models.utils import ModelMixin
from app.models.db import db

class AnonUser(AnonymousUserMixin):
    role = 'unregistered'


class User(UserMixin, db.Model, ModelMixin):
    __tablename__ = 'dashboard_users'

    id = db.Column(db.BigInteger(), primary_key=True)
    role = db.Column(db.String(255))

    def __str__(self):
        return f"id: {self.id}, role: {self.role}"