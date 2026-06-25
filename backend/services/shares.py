from __future__ import annotations

import json
import secrets
import sqlite3
from pathlib import Path
from typing import Any
from backend.config import settings
from backend.schemas import ShareSnapshot


PROJECT_ROOT = Path(__file__).resolve().parents[2]
LOCAL_SHARE_DB = PROJECT_ROOT / ".data" / "shares.sqlite3"


class ShareStorageError(RuntimeError):
    """Raised when share storage is unavailable."""


def _is_postgres_url(value: str) -> bool:
    return value.startswith("postgres://") or value.startswith("postgresql://")


def _sqlite_path_from_url(value: str) -> Path:
    if value.startswith("sqlite:///"):
        return Path(value.removeprefix("sqlite:///"))
    return LOCAL_SHARE_DB


def _share_payload(snapshot: ShareSnapshot) -> dict[str, Any]:
    if hasattr(snapshot, "model_dump"):
        return snapshot.model_dump(mode="json")
    return snapshot.dict()


def _new_share_id() -> str:
    return secrets.token_urlsafe(6).replace("-", "").replace("_", "")[:8]


def _sqlite_connect() -> sqlite3.Connection:
    # Development fallback: this local SQLite file is simple and safe, but on
    # Render Free the filesystem can be ephemeral and is not reliable across
    # restarts. Configure DATABASE_URL with a persistent database for production.
    db_path = _sqlite_path_from_url(settings.database_url)
    db_path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(db_path)
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS shares (
            id TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    return connection


def _sqlite_create_share(snapshot: ShareSnapshot) -> str:
    payload = json.dumps(_share_payload(snapshot), ensure_ascii=False)

    with _sqlite_connect() as connection:
        for _ in range(8):
            share_id = _new_share_id()
            try:
                connection.execute(
                    "INSERT INTO shares (id, payload) VALUES (?, ?)",
                    (share_id, payload),
                )
                return share_id
            except sqlite3.IntegrityError:
                continue

    raise ShareStorageError("Could not create a unique share link.")


def _sqlite_get_share(share_id: str) -> ShareSnapshot | None:
    with _sqlite_connect() as connection:
        row = connection.execute(
            "SELECT payload FROM shares WHERE id = ?",
            (share_id,),
        ).fetchone()

    if not row:
        return None

    return ShareSnapshot(**json.loads(row[0]))


async def _postgres_connect():
    try:
        import asyncpg
    except ImportError as exc:
        raise ShareStorageError(
            "DATABASE_URL is configured, but asyncpg is not installed. Install requirements.txt."
        ) from exc

    return await asyncpg.connect(settings.database_url)


async def _postgres_ensure_table(connection) -> None:
    await connection.execute(
        """
        CREATE TABLE IF NOT EXISTS shares (
            id TEXT PRIMARY KEY,
            payload JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        )
        """
    )


async def _postgres_create_share(snapshot: ShareSnapshot) -> str:
    payload = json.dumps(_share_payload(snapshot), ensure_ascii=False)
    connection = await _postgres_connect()

    try:
        await _postgres_ensure_table(connection)
        for _ in range(8):
            share_id = _new_share_id()
            result = await connection.execute(
                """
                INSERT INTO shares (id, payload)
                VALUES ($1, $2::jsonb)
                ON CONFLICT (id) DO NOTHING
                """,
                share_id,
                payload,
            )
            if result.endswith("1"):
                return share_id
    finally:
        await connection.close()

    raise ShareStorageError("Could not create a unique share link.")


async def _postgres_get_share(share_id: str) -> ShareSnapshot | None:
    connection = await _postgres_connect()

    try:
        await _postgres_ensure_table(connection)
        value = await connection.fetchval(
            "SELECT payload::text FROM shares WHERE id = $1",
            share_id,
        )
    finally:
        await connection.close()

    if not value:
        return None

    return ShareSnapshot(**json.loads(value))


async def create_share(snapshot: ShareSnapshot) -> str:
    if _is_postgres_url(settings.database_url):
        return await _postgres_create_share(snapshot)

    return _sqlite_create_share(snapshot)


async def get_share(share_id: str) -> ShareSnapshot | None:
    if _is_postgres_url(settings.database_url):
        return await _postgres_get_share(share_id)

    return _sqlite_get_share(share_id)
