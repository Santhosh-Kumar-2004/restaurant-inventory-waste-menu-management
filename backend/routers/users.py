from schemas.user import UserCreate, UserLogin, UserResponse, RoleUpdate
import models
from core.crud import (
    create_user as create_user_db,
    authenticate_user,
    get_user_by_id,
    update_user_role
)
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter, HTTPException
from core.database import get_db
# from main import get_current_user

router = APIRouter(tags=["Users"])

def get_current_user(
    email: str,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")
    return user



@router.post("/users", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return create_user_db(
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


@router.put("/users/{user_id}/role", response_model=UserResponse)
def change_user_role(
    user_id: int,
    role_data: RoleUpdate,
    email: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(email, db)

    if current_user.role.value != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    user = get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return update_user_role(db, user, role_data.role)
