import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/Orders.css";

function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="orders-page-wrapper">
      <Navbar />

      <main className="orders-content">
        <header className="orders-header">
          <div className="title-section">
            <h2>Order Hub</h2>
            <p>Manage customer service and billing from one place.</p>
          </div>
          <div className="user-info-badge">
            <span className="dot"></span>
            <span>{user?.role} Mode: <strong>{user?.full_name || user?.email}</strong></span>
          </div>
        </header>

        <section className="order-actions-grid">
          <Link to="/orders/create" className="order-card create-card">
            <div className="card-icon">➕</div>
            <div className="card-info">
              <h3>Start New Order</h3>
              <p>Open a new table and assign a waiter.</p>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/orders/items" className="order-card items-card">
            <div className="card-icon">🍽️</div>
            <div className="card-info">
              <h3>Order Items</h3>
              <p>Add food, drinks, and modifiers to a bill.</p>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/orders/invoice" className="order-card invoice-card">
            <div className="card-icon">🧾</div>
            <div className="card-info">
              <h3>Billing & Invoice</h3>
              <p>Generate final receipt and checkout.</p>
            </div>
            <span className="arrow">→</span>
          </Link>

          <Link to="/orders/all" className="order-card invoice-card">
            <div className="card-icon">🙋‍♂️</div>
            <div className="card-info">
              <h3>All Orders Are Here</h3>
              <p>Check all the Order and Modify Status.</p>
            </div>
            <span className="arrow">→</span>
          </Link>
        </section>

        <footer className="orders-footer">
          <p>KitchenPro POS v2.0 • System Online</p>
        </footer>
      </main>
    </div>
  );
}

export default Orders;