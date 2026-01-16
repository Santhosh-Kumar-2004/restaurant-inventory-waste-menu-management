import { useEffect, useState } from "react";
import { getInventoryReport } from "../services/inventoryService";

function Inventory() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));


  useEffect(() => {
    async function loadInventory() {
      try {
        const data = await getInventoryReport();
        setItems(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadInventory();
  }, []);

  return (
    <div>
      <h2>Inventory Report</h2>

        {user.role === "admin" && <p>You are an Admin</p>}
        {user.role === "chef" && <p>You are a Chef</p>}
        {user.role === "waiter" && <p>You are a Waiter</p>}


      {error && <p>{error}</p>}

      <ul>
        {items.map((item) => (
          <li key={item.inventory_item_id}>
            {item.item_name} – {item.current_stock} {item.unit}
          </li>
        ))}
      </ul>
      <button
          onClick={() => {
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          Logout
        </button>
    </div>
  );
}

export default Inventory;
