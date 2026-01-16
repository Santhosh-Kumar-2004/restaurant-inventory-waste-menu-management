from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
import core.crud
from schemas.schema import UserCreate, UserLogin, UserResponse, RoleUpdate
import models


load_dotenv()

app = FastAPI(
    title="Restaurant Inventory & Waste Management",
    description="A simple full-stack Restaurant Inventory & Waste Management System for Leanring purpose.",
    version="0.1.0",   
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

def get_current_user(
    email: str,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid user")
    return user


@app.get("/")
def root_router():
    return "The app is Running! 🚀"

@app.get("/health")
def health_check():
    return {"status": "ok"}
