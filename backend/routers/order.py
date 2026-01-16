from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.order import OrderCreate, OrderItemCreate, InvoiceResponse
from core import crud

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/")
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db)
):
    order = crud.create_order(
        db,
        data.table_number,
        data.created_by
    )
    return {"order_id": order.id, "status": "Order created"}

@router.post("/{order_id}/items")
def add_item(
    order_id: int,
    item: OrderItemCreate,
    db: Session = Depends(get_db)
):
    crud.add_order_item(db, order_id, item)
    return {"message": "Item added to order"}
