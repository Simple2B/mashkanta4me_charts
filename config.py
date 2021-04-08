import os
from pathlib import Path
from dotenv import load_dotenv


BASE_DIR = Path(".").resolve()
env_path = Path(".") / ".env"
load_dotenv(dotenv_path=env_path)


class BaseConfig(object):
    """Base configuration."""

    APP_NAME = "Mashkanta App"
    APP_ROOT = os.environ.get("APP_ROOT", "")
    DEBUG_TB_ENABLED = False
    SECRET_KEY = os.environ.get(
        "SECRET_KEY", "Ensure you set a secret key, this is important!"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    WTF_CSRF_ENABLED = False
    STATISTICS_DATABASE_URL = os.environ.get("STATISTICS_DATABASE_URL", "https://gate2.simple2b.net/dash/static/data/")

    @staticmethod
    def configure(app):
        # Implement this method to do further configuration on your app.
        pass


class DevelopmentConfig(BaseConfig):
    """Development configuration."""

    # SCRIPT_NAME = "/dash/"
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DB_ENDPOINT_DEV")


class TestingConfig(BaseConfig):
    """Testing configuration."""

    TESTING = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "TEST_DATABASE_URL",
        "sqlite:///" + os.path.join(BASE_DIR, "database-test.sqlite3"),
    )


class ProductionConfig(BaseConfig):
    """Production configuration."""

    SQLALCHEMY_DATABASE_URI = os.environ.get("DB_ENDPOINT")
    WTF_CSRF_ENABLED = True


config = dict(
    development=DevelopmentConfig, testing=TestingConfig, production=ProductionConfig
)
