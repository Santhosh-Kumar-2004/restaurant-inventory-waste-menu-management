import { useEffect, useState } from "react";
import { getInventoryReport } from "../services/inventoryService";

function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await getInventoryReport();
        setItems(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadInventory();
  }, []);

  return (
    <div className="inventory-page-container">
        <div className="inventory-card">
        {/* Header Section */}
        <div className="inventory-header">
            <div className="header-info">
            <h2>Inventory Report</h2>
            <div className="user-role-badge">
                {user.role === "admin" && <span className="badge admin">Admin Access</span>}
                {user.role === "chef" && <span className="badge chef">Chef Mode</span>}
                {user.role === "waiter" && <span className="badge waiter">Waiter Access</span>}
            </div>
            </div>
            <button
            className="logout-btn"
            onClick={() => {
                localStorage.removeItem("user");
                window.location.reload();
            }}
            >
            Logout
            </button>
        </div>

        {error && <div className="error-message">⚠️ {error}</div>}

        {/* Inventory Table */}
        <div className="table-wrapper">
            <table className="inventory-table">
            <thead>
                <tr>
                <th>Item Name</th>
                <th className="text-right">Current Stock</th>
                <th>Unit</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {items.map((item) => (
                <tr key={item.inventory_item_id}>
                    <td className="font-bold">{item.item_name}</td>
                    <td className="text-right stock-value">{item.current_stock}</td>
                    <td className="unit-label">{item.unit}</td>
                    <td>
                    {item.current_stock <= 5 ? (
                        <span className="stock-tag low">Low Stock</span>
                    ) : (
                        <span className="stock-tag healthy">Healthy</span>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        
        {items.length === 0 && !error && (
            <div className="empty-state">No inventory items found.</div>
        )}
        </div>
    </div>
    );
}

export default Inventory;
