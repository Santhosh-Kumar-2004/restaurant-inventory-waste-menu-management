import React, { useEffect, useState } from "react";
import { apiFetch } from "../api/http";
import Navbar from "../components/Navbar";
import "./AllOrders.css";

function AllOrders() {
//   const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/orders");
      // Sort orders by newest first
      setOrders(data.sort((a, b) => b.id - a.id));
    } catch (err) {
      console.error("Failed to fetch orders", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="all-orders-page">
      <Navbar />
      
      <main className="all-orders-container">
        <header className="orders-dashboard-header">
          <div className="header-text">
            <h2>Live Order Dashboard</h2>
            <p>Monitor all active and past table sessions.</p>
          </div>
          <button 
            className={`refresh-btn ${loading ? 'spinning' : ''}`} 
            onClick={loadOrders}
          >
            {loading ? "🔄" : "Refresh Board"}
          </button>
        </header>

        <div className="orders-grid">
          {orders.length === 0 ? (
            <div className="no-orders">No orders found in the system.</div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className={`order-summary-card ${order.status.toLowerCase()}`}>
                <div className="card-top">
                  <span className="table-number-circle">T{order.table_number}</span>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="card-body">
                  <div className="data-row">
                    <span className="label">Order Reference</span>
                    <span className="value">#{order.id}</span>
                  </div>
                  <div className="data-row">
                    <span className="label">Created At</span>
                    <span className="value">
                      {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="card-footer">
                  <button className="view-details-btn">View Full Bill</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default AllOrders;