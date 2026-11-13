"""Development seed command for Learnova.

Enforces execution ONLY in development/test environments.
Initializes canonical roles and optional development-only accounts.
"""

import hashlib
import logging
import os
import sys
import uuid
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.profile import UserProfile
from app.models.role import Role
from app.models.user import User

logger = logging.getLogger("learnova.cli.seed")

CANONICAL_ROLES = [
    {
        "id": uuid.UUID("11111111-1111-1111-1111-111111111111"),
        "name": "student",
        "description": "Student learner account with course and assessment access",
    },
    {
        "id": uuid.UUID("22222222-2222-2222-2222-222222222222"),
        "name": "teacher",
        "description": "Teacher account with course management and curriculum authoring access",
    },
    {
        "id": uuid.UUID("33333333-3333-3333-3333-333333333333"),
        "name": "administrator",
        "description": "System administrator with platform governance and oversight privileges",
    },
]


def _hash_seed_password(plain: str) -> str:
    """Generate a hashed password representation for seed accounts.
    
    Ensures plaintext passwords are never stored in the database.
    """
    digest = hashlib.sha256(plain.encode("utf-8")).hexdigest()
    # Format with algorithm prefix
    return f"sha256${digest}"


def seed_database(db: Optional[Session] = None) -> None:
    """Seed the database with foundational roles and optional dev test accounts."""
    env = settings.ENVIRONMENT.lower()
    if env not in ("development", "test", "local"):
        logger.error(
            "ABORTED: Seeding is strictly forbidden in non-development environment '%s'.",
            env,
        )
        raise RuntimeError(
            f"Database seeding is forbidden in environment '{settings.ENVIRONMENT}'"
        )

    session = db or SessionLocal()
    try:
        # 1. Seed canonical roles
        for role_data in CANONICAL_ROLES:
            stmt = select(Role).where(Role.name == role_data["name"])
            existing_role = session.scalars(stmt).first()
            if not existing_role:
                new_role = Role(
                    id=role_data["id"],
                    name=role_data["name"],
                    description=role_data["description"],
                )
                session.add(new_role)
                logger.info("Seeded canonical role: %s", role_data["name"])

        session.commit()

        # 2. Seed dev accounts for all three canonical roles
        seed_dev_accounts = os.getenv("DEV_SEED_ACCOUNTS", "true").lower() == "true"
        if seed_dev_accounts:
            dev_accounts = [
                {
                    "email": "student@learnova.edu",
                    "password": "student123",
                    "full_name": "Alex Rivera",
                    "role_name": "student",
                    "department": "Computer Science",
                    "bio": "Undergraduate student specializing in software systems and algorithms.",
                },
                {
                    "email": "teacher@learnova.edu",
                    "password": "teacher123",
                    "full_name": "Elena Rostova",
                    "role_name": "teacher",
                    "department": "Computer Science & Engineering",
                    "bio": "Lead instructor for Data Structures and Distributed Systems.",
                },
                {
                    "email": "admin@learnova.edu",
                    "password": "admin123",
                    "full_name": "Sarah Connor",
                    "role_name": "administrator",
                    "department": "Platform Governance",
                    "bio": "System administrator with platform governance and security audit oversight.",
                },
            ]

            for acc in dev_accounts:
                role = session.scalars(
                    select(Role).where(Role.name == acc["role_name"])
                ).first()

                if role:
                    existing_user = session.scalars(
                        select(User).where(User.email == acc["email"])
                    ).first()

                    if not existing_user:
                        user = User(
                            id=uuid.uuid4(),
                            email=acc["email"],
                            hashed_password=_hash_seed_password(acc["password"]),
                            full_name=acc["full_name"],
                            role_id=role.id,
                            is_active=True,
                        )
                        session.add(user)
                        session.flush()

                        profile = UserProfile(
                            id=uuid.uuid4(),
                            user_id=user.id,
                            bio=acc["bio"],
                            department=acc["department"],
                            preferences={"theme": "system", "emailNotifications": True},
                        )
                        session.add(profile)
                        session.commit()
                        logger.info("Seeded dev %s account: %s", acc["role_name"], acc["email"])
                    else:
                        logger.info("Dev account %s already exists; skipping.", acc["email"])

        logger.info("Database seeding completed successfully.")
    except Exception as exc:
        session.rollback()
        logger.error("Seeding failed: %s", exc)
        raise
    finally:
        if db is None:
            session.close()


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    try:
        seed_database()
        print("Database seed completed.")
    except Exception as exc:
        print(f"Error: {exc}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
