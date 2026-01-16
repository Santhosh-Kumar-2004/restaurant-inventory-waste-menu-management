import { useState } from "react";
import { createInventoryItem } from "../services/inventoryService";
import "../styles/InventoryCreate.css"

function InventoryCreate() {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState("kg");
  const [minimumStock, setMinimumStock] = useState(0);
  const [message, setMessage] = useState("");

  const handleCreate = async () => {
      if (!name || !unit || !minimumStock) {
          alert("Create atleast one item or leave this page!")
          setMessage("Inventory Item Is not created")
      }
      try {
      await createInventoryItem({
        name,
        unit,
        minimum_stock: Number(minimumStock)
      });

      setName("");
      setMinimumStock(0);
      setMessage("Inventory item created successfully");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div className="inventory-create-container">
        <div className="inventory-create-card">
        <div className="create-header">
            <div className="icon-badge">➕</div>
            <h2>Add New Stock Item</h2>
            <p>Define a new item to track in your kitchen inventory.</p>
        </div>

        <div className="create-form">
            <div className="form-input-group">
            <label>Item Name</label>
            <input
                placeholder="e.g. Fresh Tomatoes"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            </div>

            <div className="form-row">
            <div className="form-input-group">
                <label>Measurement Unit</label>
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                <option value="kg">Kilograms (kg)</option>
                <option value="liter">Liters (L)</option>
                <option value="piece">Pieces (pcs)</option>
                <option value="gram">Grams (g)</option>
                </select>
            </div>

            <div className="form-input-group">
                <label>Minimum Stock Alert</label>
                <input
                type="number"
                placeholder="e.g. 5"
                value={minimumStock}
                onChange={(e) => setMinimumStock(e.target.value)}
                />
            </div>
            </div>

            <button className="create-submit-btn" onClick={handleCreate}>
            Create Inventory Item
            </button>
        </div>

        {message && (
            <div className={`form-feedback ${message.includes("success") ? "success" : "error"}`}>
            {message}
            </div>
        )}
        
        <div className="create-footer">
            <p>This item will be visible to all Chefs and Admins.</p>
        </div>
        </div>
    </div>
    );
}

export default InventoryCreate;
