from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.inventory import (
    InventoryItemCreate,
    InventoryItemResponse,
    InflowCreate,
    OutflowCreate,
    WasteCreate
)
from core import crud

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.post("/items", response_model=InventoryItemResponse)
def create_item(
    item: InventoryItemCreate,
    db: Session = Depends(get_db)
):
    return crud.create_inventory_item(
        db,
        item.name,
        item.unit,
        item.minimum_stock
    )


@router.post("/inflow")
def record_inflow(
    data: InflowCreate,
    db: Session = Depends(get_db)
):
    crud.add_inflow(db, data)
    return {"message": "Inflow recorded"}


@router.post("/outflow")
def record_outflow(
    data: OutflowCreate,
    db: Session = Depends(get_db)
):
    crud.add_outflow(db, data)
    return {"message": "Outflow recorded"}


@router.post("/waste")
def record_waste(
    data: WasteCreate,
    db: Session = Depends(get_db)
):
    crud.add_waste(db, data)
    return {"message": "Waste recorded"}
