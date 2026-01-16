import { useEffect, useState } from "react";
import { getInventoryReport } from "../services/inventoryService";
import { apiFetch } from "../api/http";
import "../styles/InventoryWaste.css"
import Navbar from "../components/Navbar";

function InventoryWaste() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadItems() {
      const data = await getInventoryReport();
      setItems(data);
    }
    loadItems();
  }, []);

  const handleWaste = async () => {
    try {
      await apiFetch("/inventory/waste", {
        method: "POST",
        body: JSON.stringify({
          inventory_item_id: Number(itemId),
          quantity: Number(quantity),
          unit,
          reason,
          reported_by: user.user_id
        })
      });

      setMessage("Waste recorded successfully");
      setQuantity("");
      setReason("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="waste-container">
        <Navbar />
        <div className="waste-card">
        <div className="waste-header">
            <div className="header-icon">🗑️</div>
            <h2>Waste Management</h2>
            <p>Record spoiled, expired, or damaged inventory to maintain accurate stock.</p>
        </div>

        <div className="waste-form">
            <div className="form-group">
            <label>Wasted Item</label>
            <select 
                className="styled-select" 
                onChange={(e) => setItemId(e.target.value)}
                value={itemId}
            >
                <option value="">Select an item...</option>
                {items.map((item) => (
                <option key={item.inventory_item_id} value={item.inventory_item_id}>
                    {item.item_name}
                </option>
                ))}
            </select>
            </div>

            <div className="form-row">
            <div className="form-group">
                <label>Amount Wasted</label>
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
                className="styled-select" 
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
            <label>Reason for Waste</label>
            <input
                className="styled-input"
                placeholder="e.g., Expired, Spilled, Overcooked"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
            />
            </div>

            <button className="waste-submit-btn" onClick={handleWaste}>
            Log Waste Entry
            </button>
        </div>

        {message && (
            <div className={`status-message ${message.includes("successfully") ? "success" : "error"}`}>
            {message}
            </div>
        )}

        <div className="waste-footer">
            <p>Reported by: <strong>{user?.email}</strong></p>
        </div>
        </div>
    </div>
    );
}

export default InventoryWaste;
