from flask_login import UserMixin, AnonymousUserMixin
from app import db


class User(db.Model, UserMixin):
    __tablename__ = 'wpti_users'

    ID = db.Column(db.Integer, primary_key=True)
    user_login = db.Column(db.String(60), unique=True, nullable=False)

    def __str__(self):
        return '<User: %s>' % self.user_login


class AnonymousUser(AnonymousUserMixin):
    pass