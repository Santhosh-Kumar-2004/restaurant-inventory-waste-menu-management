import { useState } from "react";
import { generateInvoice } from "../services/orderService";

function Invoice() {
  const orderId = localStorage.getItem("current_order_id");
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  if (!orderId) {
    return <p>No active order found. Please create an order first.</p>;
  }

  const handleGenerateInvoice = async () => {
    try {
      const data = await generateInvoice(orderId);
      setInvoice(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Invoice</h2>

      <button onClick={handleGenerateInvoice}>
        Generate Invoice
      </button>

      {error && <p>{error}</p>}

      {invoice && (
        <div>
          <p><strong>Order ID:</strong> {invoice.order_id}</p>
          <p><strong>Subtotal:</strong> ₹{invoice.subtotal}</p>
          <p><strong>GST ({invoice.gst_rate}%):</strong> ₹{invoice.gst_amount}</p>
          <p><strong>Total Amount:</strong> ₹{invoice.total_amount}</p>
        </div>
      )}
    </div>
  );
}

export default Invoice;
