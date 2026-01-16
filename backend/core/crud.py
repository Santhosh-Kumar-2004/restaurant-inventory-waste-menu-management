from sqlalchemy.orm import Session
from models.user import User, UserRole
import hashlib
from sqlalchemy.orm import Session
from models.inventory import (
    InventoryItem,
    InventoryInflow,
    InventoryOutflow,
    WasteLog,
    InventoryUnit
)
from models.order import Order, OrderItem, Invoice


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()


def create_user(db: Session, full_name: str, email: str, password: str):
    user = User(
        full_name=full_name,
        email=email,
        password_hash=hash_password(password),
        role=UserRole.user
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str):
    password_hash = hash_password(password)
    return db.query(User).filter(
        User.email == email,
        User.password_hash == password_hash,
        User.is_active == True
    ).first()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()


def update_user_role(db: Session, user: User, role: str):
    user.role = UserRole(role)
    db.commit()
    db.refresh(user)
    return user


def create_inventory_item(db: Session, name: str, unit: str, minimum_stock: float):
    item = InventoryItem(
        name=name,
        unit=InventoryUnit(unit),
        minimum_stock=minimum_stock
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def add_inflow(db: Session, data):
    inflow = InventoryInflow(
        inventory_item_id=data.inventory_item_id,
        quantity=data.quantity,
        unit=InventoryUnit(data.unit),
        received_by=data.received_by
    )
    db.add(inflow)
    db.commit()
    return inflow


def add_outflow(db: Session, data):
    outflow = InventoryOutflow(
        inventory_item_id=data.inventory_item_id,
        quantity=data.quantity,
        unit=InventoryUnit(data.unit),
        reason=data.reason,
        used_by=data.used_by
    )
    db.add(outflow)
    db.commit()
    return outflow


def add_waste(db: Session, data):
    waste = WasteLog(
        inventory_item_id=data.inventory_item_id,
        quantity=data.quantity,
        unit=InventoryUnit(data.unit),
        reason=data.reason,
        reported_by=data.reported_by
    )
    db.add(waste)
    db.commit()
    return waste

def create_order(db, table_number: int, created_by: int):
    order = Order(
        table_number=table_number,
        created_by=created_by
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


def add_order_item(db, order_id: int, item):
    order_item = OrderItem(
        order_id=order_id,
        item_name=item.item_name,
        quantity=item.quantity,
        price_per_unit=item.price_per_unit
    )
    db.add(order_item)
    db.commit()
    return order_item


def generate_invoice(db, order_id: int, gst_rate: float = 5):
    items = db.query(OrderItem).filter(OrderItem.order_id == order_id).all()

    subtotal = sum(
        float(i.quantity) * float(i.price_per_unit)
        for i in items
    )

    gst_amount = (subtotal * gst_rate) / 100
    total_amount = subtotal + gst_amount

    invoice = Invoice(
        order_id=order_id,
        subtotal=subtotal,
        gst_rate=gst_rate,
        gst_amount=gst_amount,
        total_amount=total_amount
    )

    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice