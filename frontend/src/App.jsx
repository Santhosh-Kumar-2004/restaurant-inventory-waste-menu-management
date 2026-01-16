import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import AdminUsers from "./pages/AdminUsers";
import Home from "./pages/Home";
// import Orders from "./pages/Orders";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));



  return (
    <div>
      <h1>Restaurant System</h1>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inventory" element={<Inventory />} />
        {/* <Route path="/orders" element={<Orders />} /> */}
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {user.role === "admin" && (
          <Route path="/admin/users" element={<AdminUsers />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
