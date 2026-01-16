from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from core.database import get_db
from schemas.order import OrderCreate, OrderItemCreate, InvoiceResponse
from core import crud
from models.order import Order

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

@router.post("/{order_id}/invoice", response_model=InvoiceResponse)
def generate_invoice(
    order_id: int,
    db: Session = Depends(get_db)
):
    invoice = crud.generate_invoice(db, order_id)

    return {
        "order_id": invoice.order_id,
        "subtotal": invoice.subtotal,
        "gst_rate": invoice.gst_rate,
        "gst_amount": invoice.gst_amount,
        "total_amount": invoice.total_amount
    }

@router.put("/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if status not in ["placed", "preparing", "served"]:
        raise HTTPException(status_code=400, detail="Invalid status")

    order.status = status
    db.commit()

    return {
        "message": "Order status updated",
        "order_id": order.id,
        "status": order.status
    }

@router.get("/")
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(Order).order_by(Order.id.desc()).all()
