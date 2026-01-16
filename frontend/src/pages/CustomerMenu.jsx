import React, { useEffect, useState } from "react";
import { getMenuItems } from "../services/menuService";
import { createOrder, addOrderItem } from "../services/orderService";
import "../styles/CustomerMenu.css";
import Navbar from "../components/Navbar";

function CustomerMenu() {
  const params = new URLSearchParams(window.location.search);
  const tableNumber = Number(params.get("table"));

  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    async function loadMenu() {
      const data = await getMenuItems();
      setMenu(data.filter((item) => item.is_available));
    }
    loadMenu();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const placeOrder = async () => {
    try {
      const order = await createOrder({
        table_number: tableNumber,
        created_by: null,
      });

      for (const item of cart) {
        await addOrderItem(order.order_id, {
          item_name: item.name,
          quantity: item.quantity,
          price_per_unit: item.price,
        });
      }

      setOrderId(order.order_id);
      setCart([]);
      setMessage("Order placed successfully! Please wait while we prepare your meal.");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!tableNumber) return <div className="qr-error">Invalid QR Code. Please ask staff for assistance.</div>;

  return (
    <div className="customer-menu-app">
        <Navbar />
      <header className="menu-nav">
        <h1>KitchenPro</h1>
        <div className="table-badge">Table {tableNumber}</div>
      </header>

      <div className="menu-container">
        <section className="menu-list">
          <h3>Menu</h3>
          {menu.map((item) => (
            <div className="menu-item-card" key={item.id}>
              <div className="item-details">
                <h4>{item.name}</h4>
                <p className="item-category">{item.category}</p>
                <span className="price">₹{item.price}</span>
              </div>
              <button className="add-btn" onClick={() => addToCart(item)}>
                Add <span>+</span>
              </button>
            </div>
          ))}
        </section>

        {cart.length > 0 && (
          <div className="cart-overlay">
            <div className="cart-content">
              <h3>Your Order</h3>
              <div className="cart-items">
                {cart.map((item) => (
                  <div key={item.id} className="cart-row">
                    <span>{item.name} <small>x{item.quantity}</small></span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <span>Total Amount</span>
                <span>₹{cartTotal}</span>
              </div>
              <button className="place-order-btn" onClick={placeOrder}>
                Place Order Now
              </button>
              <button className="place-order-btn" onClick={removeFromCart}>
                Remove From Cart
              </button>
            </div>
          </div>
        )}

        {message && (
          <div className="success-modal">
            <div className="modal-content">
              <div className="success-icon">🎉</div>
              <h2>Thank You!</h2>
              <p>{message}</p>
              {orderId && <div className="order-id-tag">Order ID: #{orderId}</div>}
              <button onClick={() => setMessage("")}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerMenu;