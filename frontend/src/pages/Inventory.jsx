import { useEffect, useState } from "react";
import { getInventoryReport } from "../services/inventoryService";
import "../styles/Inventory.css"
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";

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
        <Navbar />

        <div className="inventory-card">

        {/* ===== Admin Inventory Actions ===== */}
        {user.role === "admin" && (
            <div className="inventory-admin-section">
                <div className="admin-section-header">
                <h3>Admin Command Center</h3>
                <span className="admin-badge">Management Mode</span>
                </div>
                
                <div className="admin-action-grid">
                <Link to="/inventory/create" className="action-card create">
                    <span className="action-icon">➕</span>
                    <div className="action-text">
                    <span className="action-title">Create Item</span>
                    <p>Add new stock to system</p>
                    </div>
                </Link>

                <Link to="/inventory/inflow" className="action-card inflow">
                    <span className="action-icon">📥</span>
                    <div className="action-text">
                    <span className="action-title">Log Inflow</span>
                    <p>Record new deliveries</p>
                    </div>
                </Link>

                <Link to="/inventory/outflow" className="action-card outflow">
                    <span className="action-icon">📤</span>
                    <div className="action-text">
                    <span className="action-title">Log Outflow</span>
                    <p>Record stock usage</p>
                    </div>
                </Link>

                <Link to="/inventory/waste" className="action-card waste">
                    <span className="action-icon">🗑️</span>
                    <div className="action-text">
                    <span className="action-title">Log Waste</span>
                    <p>Track spoiled items</p>
                    </div>
                </Link>
                </div>
            </div>
            )}

        {/* ===== Header Section ===== */}
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

        {/* ===== Inventory Table ===== */}
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
                    <td className="text-right stock-value">
                    {item.current_stock}
                    </td>
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
