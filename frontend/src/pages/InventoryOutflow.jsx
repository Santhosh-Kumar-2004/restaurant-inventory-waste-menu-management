import { useEffect, useState } from "react";
import { getInventoryReport } from "../services/inventoryService";
import { apiFetch } from "../api/http";
import "../styles/InventoryOutflow.css"

function InventoryOutflow() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [reason, setReason] = useState("order_preparation");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadItems() {
      const data = await getInventoryReport();
      setItems(data);
    }
    loadItems();
  }, []);

  const handleOutflow = async () => {
    try {
      await apiFetch("/inventory/outflow", {
        method: "POST",
        body: JSON.stringify({
          inventory_item_id: Number(itemId),
          quantity: Number(quantity),
          unit,
          reason,
          used_by: user.user_id
        })
      });

      setMessage("Outflow recorded successfully");
      setQuantity("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="outflow-container">
        <div className="outflow-card">
        <div className="outflow-header">
            <div className="header-icon">📤</div>
            <h2>Inventory Outflow</h2>
            <p>Record stock usage for kitchen prep or staff meals.</p>
        </div>

        <div className="outflow-form">
            <div className="form-group">
            <label>Item Consumed</label>
            <select 
                className="styled-input" 
                onChange={(e) => setItemId(e.target.value)}
                value={itemId}
            >
                <option value="">Choose an item...</option>
                {items.map((item) => (
                <option key={item.inventory_item_id} value={item.inventory_item_id}>
                    {item.item_name}
                </option>
                ))}
            </select>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>Quantity Used</label>
                <input
                type="number"
                className="styled-input"
                placeholder="0.00"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Unit</label>
                <select 
                className="styled-input" 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
                >
                <option value="kg">Kg</option>
                <option value="liter">Liter</option>
                <option value="piece">Piece</option>
                </select>
            </div>
            </div>

            <div className="form-group">
            <label>Reason for Usage</label>
            <select 
                className="styled-input" 
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
            >
                <option value="order_preparation">🍽️ Order Preparation</option>
                <option value="staff_meal">🧑‍🍳 Staff Meal</option>
                <option value="testing">🧪 Testing/Quality Check</option>
            </select>
            </div>

            <button className="outflow-submit-btn" onClick={handleOutflow}>
            Confirm Stock Usage
            </button>
        </div>

        {message && (
            <div className={`form-feedback ${message.includes("success") ? "success" : "error"}`}>
            {message}
            </div>
        )}

        <div className="outflow-footer">
            <p>Logged by: <strong>{user?.role}</strong> ({user?.email})</p>
        </div>
        </div>
    </div>
    );
}

export default InventoryOutflow;
