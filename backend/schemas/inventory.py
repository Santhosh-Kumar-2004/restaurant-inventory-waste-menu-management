from pydantic import BaseModel
from typing import Optional


class InventoryItemCreate(BaseModel):
    name: str
    unit: str
    minimum_stock: Optional[float] = 0


class InventoryItemResponse(BaseModel):
    id: int
    name: str
    unit: str
    minimum_stock: float

    class Config:
        from_attributes = True


class InflowCreate(BaseModel):
    inventory_item_id: int
    quantity: float
    unit: str
    received_by: int


class OutflowCreate(BaseModel):
    inventory_item_id: int
    quantity: float
    unit: str
    reason: Optional[str]
    used_by: int


class WasteCreate(BaseModel):
    inventory_item_id: int
    quantity: float
    unit: str
    reason: Optional[str]
    reported_by: int
