from schemas.schema import UserCreate, UserLogin, UserResponse, RoleUpdate
import models
from core.crud import create_user, authenticate_user
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from core.database import get_db

router = APIRouter(prefix="/users")

@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(
        db,
        user.full_name,
        user.email,
        user.password
    )

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": db_user.id,
        "role": db_user.role.value
    }
