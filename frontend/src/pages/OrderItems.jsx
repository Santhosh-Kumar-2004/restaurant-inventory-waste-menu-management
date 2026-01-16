import { useState } from "react";
import { addOrderItem } from "../services/orderService";

function OrderItems() {
  const orderId = localStorage.getItem("current_order_id");

  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  if (!orderId) {
    return <p>No active order found. Please create an order first.</p>;
  }

  const handleAddItem = async () => {
    try {
      await addOrderItem(orderId, {
        item_name: itemName,
        quantity: Number(quantity),
        price_per_unit: Number(price),
      });

      setMessage("Item added to order");
      setItemName("");
      setQuantity("");
      setPrice("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Add Items to Order (Order #{orderId})</h2>

      <input
        placeholder="Item name (e.g. Chicken Biryani)"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
      />

      <input
        type="number"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price per unit"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleAddItem}>Add Item</button>

      <p>{message}</p>
    </div>
  );
}

export default OrderItems;
