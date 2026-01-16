import { useEffect, useState } from "react";
import { getMenuItems } from "../services/menuService";
import { createOrder, addOrderItem } from "../services/orderService";

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

  const placeOrder = async () => {
    try {
      const order = await createOrder({
        table_number: tableNumber,
        created_by: null, // SYSTEM / GUEST
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
      setMessage("Order placed successfully");
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (!tableNumber) {
    return <p>Invalid QR code</p>;
  }

  return (
    <div>
      <h2>Table {tableNumber} – Menu</h2>

      {menu.map((item) => (
        <div key={item.id}>
          <strong>{item.name}</strong> – ₹{item.price}
          <button onClick={() => addToCart(item)}>Add</button>
        </div>
      ))}

      <hr />

      <h3>Cart</h3>

      {cart.map((item) => (
        <p key={item.id}>
          {item.name} × {item.quantity}
        </p>
      ))}

      {cart.length > 0 && (
        <button onClick={placeOrder}>Place Order</button>
      )}

      {message && <p>{message}</p>}
      {orderId && <p>Your Order ID: {orderId}</p>}
    </div>
  );
}

export default CustomerMenu;
