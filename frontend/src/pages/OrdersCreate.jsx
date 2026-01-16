import { useState } from "react";
import { createOrder } from "../services/orderService";
import "../styles/OrderCreate.css"
import Navbar from "../components/Navbar";

function OrdersCreate() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [tableNumber, setTableNumber] = useState("");
  const [result, setResult] = useState("");

  const handleCreateOrder = async () => {
    try {
      const res = await createOrder({
        table_number: Number(tableNumber),
        created_by: user.user_id,
      });

      // store current order id for next steps
      localStorage.setItem("current_order_id", res.order_id);

      setResult(`Order created successfully. Order ID: ${res.order_id}`);
      setTableNumber("");
    } catch (err) {
      setResult(err.message);
    }
  };

  return (
    <div className="order-create-container">
        <Navbar />
        <div className="order-create-card">
        <div className="order-header">
            <div className="order-icon">🍽️</div>
            <h2>New Service Order</h2>
            <p>Assign a table number to begin the order process.</p>
        </div>

        <div className="order-form">
            <div className="table-input-section">
            <label>Table Number</label>
            <input
                type="number"
                className="table-number-input"
                placeholder="00"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                autoFocus
            />
            </div>

            <button 
            className="create-order-btn" 
            onClick={handleCreateOrder}
            disabled={!tableNumber}
            >
            Open Table Order
            </button>
        </div>

        {result && (
            <div className={`order-result-banner ${result.includes("Order ID") ? "success" : "error"}`}>
            {result}
            {result.includes("Order ID") && (
                <div className="order-next-steps">
                <small>System ready for item entry.</small>
                </div>
            )}
            </div>
        )}

        <div className="waiter-context">
            <span>Waiter: <strong>{user?.full_name || user?.email}</strong></span>
        </div>
        </div>
    </div>
    );
}

export default OrdersCreate;
