import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3 className="navbar-logo">🍽 Restaurant System</h3>

        <Link to="/">Home</Link>
        <Link to="/inventory">Inventory</Link>

        {/* 👑 Admin-only links */}
        {user.role === "admin" && (
          <>
            <Link to="/admin/users">Users</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          {user.email} ({user.role})
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
