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
    <nav className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-left">
          <div className="navbar-brand">
            <span className="brand-icon">🍽️</span>
            <h3 className="navbar-logo">KitchenPro</h3>
          </div>

          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/inventory" className="nav-link">Inventory</Link>

            {/* 👑 Admin-only links */}
            {user.role === "admin" && (
              <Link to="/admin/users" className="nav-link admin-link">
                Staff Management
              </Link>
            )}
            {/* 👑 Admin-only links */}
            {user.role === "admin" && (
              <Link to="/inventory/create" className="nav-link admin-link">
                Inventory Create
              </Link>
            )}
            {user.role === "admin" && (
              <Link to="/inventory/inflow" className="nav-link admin-link">
                Inventory Inflow
              </Link>
            )}
          </div>
        </div>

        <div className="navbar-right">
          <div className="user-profile">
            <div className="user-details">
              <span className="user-email">{user.email}</span>
              <span className={`role-tag ${user.role}`}>{user.role}</span>
            </div>
            <button onClick={handleLogout} className="logout-action-btn">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;