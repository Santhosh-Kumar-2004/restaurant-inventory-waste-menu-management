from schemas.schema import UserCreate, UserLogin, UserResponse, RoleUpdate
import models
from core.crud import create_user, authenticate_user
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from core.database import get_db
from main import get_current_user

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

@router.get("/users", response_model=list[UserResponse])
def get_users(
    email: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(email, db)

    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return db.query(models.User).all()
