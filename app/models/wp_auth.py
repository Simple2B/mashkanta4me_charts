import datetime

from app import db
from app.models.utils import ModelMixin
from sqlalchemy.orm import relationship


class WpAuthKey(db.Model, ModelMixin):
    __tablename__ = 'wpti_proxy_tmp_keys'

    id = db.Column(db.Integer, primary_key=True)
    creation_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    uuid = db.Column(db.String(60), nullable=False)
    roles = db.Column(db.String(255))
    wp_user_id = relationship('User')

    def __str__(self):
        return '<Uuid: %s>' % self.uuid

