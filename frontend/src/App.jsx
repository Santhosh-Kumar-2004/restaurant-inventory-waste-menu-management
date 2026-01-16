import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import AdminUsers from "./pages/AdminUsers";
import InventoryCreate from "./pages/InventoryCreate";


import PrivateRoute from "./routers/privateRoutes";
import AdminRoute from "./routers/AdminRoute";
import InventoryInflow from "./pages/InventoryInflow";

function App() {
  return (
    <div>
      {/* <h1>Restaurant System</h1> */}

      <Routes>
        {/* 🌍 Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 🔐 Authenticated Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/inventory" element={<Inventory />} />
        </Route>

        {/* 👑 Admin Only Routes */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/inventory/create" element={<InventoryCreate />} />
          <Route path="/inventory/inflow" element={<InventoryInflow />} />
        </Route>

        {/* 🚫 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
