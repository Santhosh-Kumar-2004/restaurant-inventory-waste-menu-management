from sqlalchemy import Column, Integer, String, Boolean, Enum
from core.database import Base
import enum


class UserRole(enum.Enum):
    user = "user"
    admin = "admin"
    chef = "chef"
    waiter = "waiter"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.user, nullable=False)
    is_active = Column(Boolean, default=True)
