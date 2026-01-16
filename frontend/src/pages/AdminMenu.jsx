import React, { useEffect, useState } from "react";
import { createMenuItem, getMenuItems, toggleMenuItem } from "../services/menuService";
import "./AdminMenu.css";

function AdminMenu() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await getMenuItems();
      setMenu(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      await createMenuItem({ name, category, price: Number(price) });
      setName(""); setCategory(""); setPrice("");
      setMessage("✅ Menu item created successfully");
      loadMenu();
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItem(id);
      loadMenu();
    } catch (err) {
      alert(err.message);
    }
  };

  if (user?.role !== "admin") return <div className="access-denied">Access denied. Admins only.</div>;

  return (
    <div className="admin-menu-container">
      <div className="admin-menu-header">
        <h2>Menu Management</h2>
        <p>Create and control your restaurant's digital menu</p>
      </div>

      <div className="menu-management-grid">
        {/* Create Section */}
        <div className="menu-card create-section">
          <h3>Add New Item</h3>
          <div className="form-group">
            <label>Item Name</label>
            <input placeholder="e.g. Garlic Bread" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select Category</option>
              <option value="Starter">Starter</option>
              <option value="Main">Main Course</option>
              <option value="Drink">Drink</option>
              <option value="Dessert">Dessert</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (₹)</label>
            <input type="number" placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <button className="add-item-btn" onClick={handleCreate}>Create Item</button>
          {message && <p className="status-message">{message}</p>}
        </div>

        {/* List Section */}
        <div className="menu-card list-section">
          <h3>Live Menu ({menu.length} items)</h3>
          <div className="table-wrapper">
            <table className="menu-table">
              <thead>
                <tr>
                  <th>Dish Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {menu.map((item) => (
                  <tr key={item.id}>
                    <td className="font-bold">{item.name}</td>
                    <td><span className="category-tag">{item.category}</span></td>
                    <td>₹{item.price}</td>
                    <td>
                      <span className={`status-pill ${item.is_available ? "available" : "unavailable"}`}>
                        {item.is_available ? "In Stock" : "Out of Stock"}
                      </span>
                    </td>
                    <td>
                      <button 
                        className={`toggle-btn ${item.is_available ? "disable" : "enable"}`}
                        onClick={() => handleToggle(item.id)}
                      >
                        {item.is_available ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;