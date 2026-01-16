import { useEffect, useState } from "react";
import { getInventoryReport, createInventoryItem } from "../services/inventoryService";
import { apiFetch } from "../api/http";

function InventoryInflow() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [items, setItems] = useState([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadItems() {
      const data = await getInventoryReport();
      setItems(data);
    }
    loadItems();
  }, []);

  const handleInflow = async () => {
    try {
      await apiFetch("/inventory/inflow", {
        method: "POST",
        body: JSON.stringify({
          inventory_item_id: Number(itemId),
          quantity: Number(quantity),
          unit,
          received_by: user.user_id
        })
      });

      setMessage("Inflow recorded successfully");
      setQuantity("");
    } catch (err) {
      setMessage(err.message);
    }
  };

  return (
    <div>
      <h2>Inventory Inflow</h2>

      <select onChange={(e) => setItemId(e.target.value)}>
        <option value="">Select Item</option>
        {items.map((item) => (
          <option key={item.inventory_item_id} value={item.inventory_item_id}>
            {item.item_name}
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Quantity received"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <select value={unit} onChange={(e) => setUnit(e.target.value)}>
        <option value="kg">Kg</option>
        <option value="liter">Liter</option>
        <option value="piece">Piece</option>
      </select>

      <button onClick={handleInflow}>Add Inflow</button>

      <p>{message}</p>
    </div>
  );
}

export default InventoryInflow;
