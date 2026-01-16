import React, { useState } from "react";
import { addOrderItem } from "../services/orderService";
import "../styles/OrderItems.css";

function OrderItems() {
  const orderId = localStorage.getItem("current_order_id");

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  if (!orderId) {
    return (
      <div className="order-error-state">
        <div className="error-icon">⚠️</div>
        <p>No active order found. Please create an order first.</p>
        <button onClick={() => window.location.href='/orders/create'}>Create New Order</button>
      </div>
    );
  }

  const handleAddItem = async () => {
    try {
      await addOrderItem(orderId, {
        item_name: itemName,
        quantity: Number(quantity),
        price_per_unit: Number(price),
      });

      setMessage(`✅ ${itemName} added successfully`);
      setItemName("");
      setQuantity("");
      setPrice("");
      
      // Clear message after 3 seconds for better UX
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="order-items-container">
      <div className="order-items-card">
        <div className="order-items-header">
          <div className="header-top">
            <h2>Add Order Items</h2>
            <span className="order-id-badge">Order ID: #{orderId}</span>
          </div>
          <p>Enter the details of the dish or drink to add to the customer's bill.</p>
        </div>

        <div className="order-items-form">
          <div className="form-group full-width">
            <label>Item Name</label>
            <input
              placeholder="e.g. Grilled Salmon or Diet Coke"
              className="styled-input"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity</label>
              <input
                type="number"
                placeholder="1"
                className="styled-input"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Unit Price ($)</label>
              <input
                type="number"
                placeholder="0.00"
                className="styled-input"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          <button className="add-item-btn" onClick={handleAddItem}>
            Add to Order
          </button>
        </div>

        {message && (
          <div className={`order-status-msg ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderItems;