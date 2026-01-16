import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/http";
import "../styles/ChefOrders.css";
import Navbar from "../components/Navbar";

function ChefOrders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadOrders();
    // Auto-refresh every 30 seconds for the kitchen
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadOrders = async () => {
    try {
      const data = await apiFetch("/orders");
      setOrders(
        data.filter(
          (order) => order.status === "placed" || order.status === "preparing"
        )
      );
    } catch (err) {
      console.error("Failed to fetch kitchen orders", err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      await apiFetch(`/orders/${orderId}/status?status=${status}`, {
        method: "PUT",
      });
      loadOrders();
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (user?.role !== "chef") {
    return (
      <div className="denied-container">
        <h2>🚫 Access Denied</h2>
        <p>Kitchen staff credentials required.</p>
      </div>
    );
  }

  return (
    <div className="chef-dashboard">
        <Navbar />
      <header className="chef-header">
        <div className="brand">
          <h1>Kitchen Display System</h1>
          <span className="live-pulse">LIVE</span>
        </div>
        <div className="chef-stats">
          <span>Active Orders: <strong>{orders.length}</strong></span>
          <button className="refresh-btn" onClick={loadOrders}>Sync</button>
        </div>
      </header>

      <div className="tickets-container">
        {orders.length === 0 ? (
          <div className="empty-kitchen">
            <p>🍳 Kitchen is clear. No pending orders.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className={`kitchen-ticket ${order.status}`}>
              <div className="ticket-header">
                <span className="table-badge">Table {order.table_number}</span>
                <span className="order-time">#{order.id}</span>
              </div>

              <div className="ticket-content">
                <div className="status-label">
                  Current Status: <strong>{order.status.toUpperCase()}</strong>
                </div>
                {/* Note: In a real app, you'd map over order items here */}
                <p className="order-note">New order waiting for production...</p>
              </div>

              <div className="ticket-actions">
                {order.status === "placed" && (
                  <button 
                    className="action-btn start-btn"
                    onClick={() => updateStatus(order.id, "preparing")}
                  >
                    Start Cooking
                  </button>
                )}

                {order.status === "preparing" && (
                  <button 
                    className="action-btn serve-btn"
                    onClick={() => updateStatus(order.id, "served")}
                  >
                    Mark Ready/Served
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ChefOrders;