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
from sqlalchemy import func
from models.inventory import InventoryItem, InventoryInflow, InventoryOutflow, WasteLog
from models.order import Order, Invoice
from models.menu import MenuItem



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

def get_current_stock(db):
    inflow = (
        db.query(
            InventoryInflow.inventory_item_id,
            func.sum(InventoryInflow.quantity).label("total_in")
        )
        .group_by(InventoryInflow.inventory_item_id)
        .subquery()
    )

    outflow = (
        db.query(
            InventoryOutflow.inventory_item_id,
            func.sum(InventoryOutflow.quantity).label("total_out")
        )
        .group_by(InventoryOutflow.inventory_item_id)
        .subquery()
    )

    waste = (
        db.query(
            WasteLog.inventory_item_id,
            func.sum(WasteLog.quantity).label("total_waste")
        )
        .group_by(WasteLog.inventory_item_id)
        .subquery()
    )

    results = (
        db.query(
            InventoryItem.id,
            InventoryItem.name,
            InventoryItem.unit,
            func.coalesce(inflow.c.total_in, 0)
            - func.coalesce(outflow.c.total_out, 0)
            - func.coalesce(waste.c.total_waste, 0)
        )
        .outerjoin(inflow, inflow.c.inventory_item_id == InventoryItem.id)
        .outerjoin(outflow, outflow.c.inventory_item_id == InventoryItem.id)
        .outerjoin(waste, waste.c.inventory_item_id == InventoryItem.id)
        .all()
    )

    return results

def get_orders_summary(db):
    return db.query(
        Order.id,
        Order.table_number,
        Order.status
    ).all()
    
def get_invoices_summary(db):
    return db.query(
        Invoice.order_id,
        Invoice.subtotal,
        Invoice.gst_amount,
        Invoice.total_amount
    ).all()

def create_menu_item(db, data):
    item = MenuItem(
        name=data.name,
        category=data.category,
        price=data.price
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def get_menu_items(db, only_available=True):
    query = db.query(MenuItem)
    if only_available:
        query = query.filter(MenuItem.is_available == True)
    return query.all()


def toggle_menu_item(db, item_id: int):
    item = db.query(MenuItem).filter(MenuItem.id == item_id).first()
    if not item:
        return None
    item.is_available = not item.is_available
    db.commit()
    return item