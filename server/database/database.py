from typing import Generator

import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from ..config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()


def _create_sqlite_engine():
    connect_args = {}
    if settings.database_url.startswith("sqlite"):
        connect_args = {"check_same_thread": False}

    logger.warning(
        "Using SQLite engine with URL=%s. "
        "This usually means Cloud SQL config is missing or failed.",
        settings.database_url,
    )
    return create_engine(
        settings.database_url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )


def _create_cloudsql_engine():
    from google.cloud.sql.connector import Connector, IPTypes

    connector = Connector()

    def getconn():
        conn = connector.connect(
            settings.cloudsql_instance_connection_name,
            "pg8000",
            user=settings.db_user,
            password=settings.db_password,
            db=settings.db_name,
            ip_type=IPTypes.PRIVATE if settings.cloudsql_private_ip else IPTypes.PUBLIC,
        )
        return conn

    logger.info(
        "Using Cloud SQL engine for instance=%s, db=%s, user=%s",
        settings.cloudsql_instance_connection_name,
        settings.db_name,
        settings.db_user,
    )

    return create_engine(
        "postgresql+pg8000://",  # dummy URL; real connections from getconn()
        creator=getconn,
        pool_pre_ping=True,
    )


# Decide engine with fallback
USE_CLOUDSQL = (
    settings.cloudsql_instance_connection_name is not None
    and settings.db_user is not None
    and settings.db_password is not None
    and settings.db_name is not None
)

if USE_CLOUDSQL:
    try:
        engine = _create_cloudsql_engine()
    except Exception as e:
        # Log the error and fall back to SQLite so the container still starts
        logger.exception("Failed to initialize Cloud SQL engine. Falling back to SQLite. Error: %s", e)
        engine = _create_sqlite_engine()
else:
    engine = _create_sqlite_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
