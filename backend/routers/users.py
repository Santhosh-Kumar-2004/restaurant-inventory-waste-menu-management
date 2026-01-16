from schemas.schema import UserCreate, UserLogin, UserResponse, RoleUpdate
import models
from core.crud import create_user
from sqlalchemy.orm import Session
from fastapi import Depends, APIRouter
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
