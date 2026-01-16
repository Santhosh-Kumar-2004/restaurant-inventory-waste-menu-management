import { useEffect, useState } from "react";
import {
  createMenuItem,
  getMenuItems,
  toggleMenuItem,
} from "../services/menuService";

function AdminMenu() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [menu, setMenu] = useState([]);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const data = await getMenuItems();
      setMenu(data);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleCreate = async () => {
    try {
      await createMenuItem({
        name,
        category,
        price: Number(price),
      });

      setName("");
      setCategory("");
      setPrice("");
      setMessage("Menu item created");
      loadMenu();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleMenuItem(id);
      loadMenu();
    } catch (err) {
      alert(err.message);
    }
  };

  // Safety check
  if (user.role !== "admin") {
    return <p>Access denied</p>;
  }

  return (
    <div>
      <h2>Admin – Menu Management</h2>

      <h3>Create Menu Item</h3>

      <input
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Category (Starter, Main, Drink)"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button onClick={handleCreate}>Add Menu Item</button>

      <p>{message}</p>

      <hr />

      <h3>Menu Items</h3>

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Available</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>₹{item.price}</td>
              <td>{item.is_available ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleToggle(item.id)}>
                  {item.is_available ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminMenu;
