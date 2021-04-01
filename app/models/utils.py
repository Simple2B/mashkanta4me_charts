from app.models.db import db

class ModelMixin:
    def save(self):
        # save this model in DB
        db.session.add(self)
        db.session.commit()
        return self