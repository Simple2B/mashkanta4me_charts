import datetime

from app.models.db import db
from sqlalchemy.orm import relationship

class WpAuthKey(db.Model):
    __tablename__ = 'wpti_proxy_tmp_keys'

    id = db.Column(db.BigInteger(), primary_key=True)
    creation_time = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    uuid = db.Column(db.String(60), nullable=False)
    role = db.Column(db.String(255))

    def __str__(self):
        return '<Uuid: %s>' % self.uuid
