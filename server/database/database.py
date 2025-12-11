from typing import Generator

from google.cloud.sql.connector import Connector, IPTypes
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session

from ..config import settings


Base = declarative_base()

# Decide whether to use Cloud SQL or local DB (sqlite)
USE_CLOUDSQL: bool = (
    settings.cloudsql_instance_connection_name is not None
    and settings.db_user is not None
    and settings.db_password is not None
    and settings.db_name is not None
)

if USE_CLOUDSQL:
    # --- Cloud SQL via connector (production) ---
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

    engine = create_engine(
        "postgresql+pg8000://",  # dummy URL; real connections from getconn()
        creator=getconn,
        pool_pre_ping=True,
    )

else:
    # --- Local DB (SQLite) fallback ---
    connect_args = {}
    if settings.database_url.startswith("sqlite"):
        # Needed so SQLite works correctly with FastAPI's threaded usage
        connect_args = {"check_same_thread": False}

    engine = create_engine(
        settings.database_url,
        connect_args=connect_args,
        pool_pre_ping=True,
    )

# Common session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI dependency: yields a DB session and closes it afterwards.
    Usage in routes: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
