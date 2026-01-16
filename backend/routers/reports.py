from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from core.database import get_db
from core import crud

router = APIRouter(prefix="/reports", tags=["Reports"])
