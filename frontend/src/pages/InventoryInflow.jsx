import { useEffect, useState } from "react";
import { getInventoryReport } from "../services/inventoryService";
import { apiFetch } from "../api/http";
import Navbar from "../components/Navbar";

function InventoryInflow() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadItems() {
      const data = await getInventoryReport();
      setItems(data);
    }
    loadItems();
  }, []);

  const handleInflow = async () => {
    try {
      await apiFetch("/inventory/inflow", {
        method: "POST",
        body: JSON.stringify({
          inventory_item_id: Number(itemId),
          quantity: Number(quantity),
          unit,
          received_by: user.user_id
        })
      });

      setMessage("Inflow recorded successfully");
      setQuantity("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="inflow-container">
        <Navbar />
        <div className="inflow-card">
        <div className="inflow-header">
            <div className="header-icon">📥</div>
            <h2>Stock Intake</h2>
            <p>Log new supplies and inventory deliveries here.</p>
        </div>

        <div className="inflow-form">
            <div className="input-field-group">
            <label>Select Inventory Item</label>
            <select 
                className="styled-select" 
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

            <div className="inflow-row">
            <div className="input-field-group">
                <label>Quantity Received</label>
                <input
                type="number"
                placeholder="0.00"
                className="styled-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                />
            </div>

            <div className="input-field-group">
                <label>Unit</label>
                <select 
                className="styled-select" 
                value={unit} 
                onChange={(e) => setUnit(e.target.value)}
                >
                <option value="kg">Kilograms (Kg)</option>
                <option value="liter">Liters (L)</option>
                <option value="piece">Pieces (Pcs)</option>
                </select>
            </div>
            </div>

            <div className="received-info">
            <span>Receiving Officer: <strong>{user?.email}</strong></span>
            </div>

            <button className="inflow-submit-btn" onClick={handleInflow}>
            Record Intake
            </button>
        </div>

        {message && (
            <div className={`status-alert ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
            </div>
        )}
        </div>
    </div>
    );
}

export default InventoryInflow;
