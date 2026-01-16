import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Inventory from "./pages/Inventory";
// import Orders from "./pages/Orders";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Login />;
  }

  return (
    <div>
      <h1>Restaurant System</h1>

      <Routes>
        <Route path="/" element={<Inventory />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
