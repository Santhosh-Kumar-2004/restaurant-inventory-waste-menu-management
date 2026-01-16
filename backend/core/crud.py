from sqlalchemy.orm import Session
from models.user import User, UserRole
import hashlib
from sqlalchemy.orm import Session
from models.inventory import (
    InventoryItem,
    InventoryInflow,
    InventoryOutflow,
    WasteLog,
    InventoryUnit
)


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(db: Session, full_name: str, email: str, password: str):
    user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole.user
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    password_hash = hash_password(password)
    return db.query(User).filter(
        User.email == email,
        User.password_hash == password_hash,
        User.is_active == True
    ).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user_role(db: Session, user: User, role: str):
    user.role = UserRole(role)
    db.commit()
    db.refresh(user)
    return user

