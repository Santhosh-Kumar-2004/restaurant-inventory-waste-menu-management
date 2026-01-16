import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../styles/AdminUsers.css"
import Navbar from "../components/Navbar";

function AdminUsers() {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // 🔐 Protect admin route
  useEffect(() => {
    if (!admin) {
      navigate("/login");
      return;
    }

    if (admin.role !== "admin") {
      navigate("/");
      return;
    }
  }, [admin, navigate]);

  useEffect(() => {
    if (!admin?.email) return;

    async function loadUsers() {
      try {
        const data = await getAllUsers(admin.email);
        setUsers(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadUsers();
  }, [admin?.email]);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole, admin.email);

      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, role: newRole } : u
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (!admin) return null;

  return (
    <div className="admin-container">
        <Navbar />
        <div className="admin-card">
        <div className="admin-header">
            <div className="title-section">
            <h2>User Management</h2>
            <p>Manage restaurant staff roles and permissions</p>
            </div>
            <div className="admin-stats">
            <span className="user-count">Total Users: {users.length}</span>
            </div>
        </div>

        {error && <div className="admin-error-banner">⚠️ {error}</div>}

        <div className="table-responsive">
            <table className="admin-users-table">
            <thead>
                <tr>
                <th>Staff Member</th>
                <th>Email Address</th>
                <th>Current Role</th>
                <th className="text-center">Modify Permissions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                <tr key={user.id} className={user.role === 'admin' ? 'row-admin' : ''}>
                    <td>
                    <div className="user-info-cell">
                        <div className="avatar-circle">
                        {user.full_name.charAt(0)}
                        </div>
                        <span className="user-name">{user.full_name}</span>
                    </div>
                    </td>
                    <td className="user-email">{user.email}</td>
                    <td>
                    <span className={`role-pill ${user.role}`}>
                        {user.role}
                    </span>
                    </td>
                    <td className="text-center">
                    {user.id !== admin.id ? (
                        <div className="select-wrapper">
                        <select
                            className="role-select"
                            value={user.role}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                            <option value="user">User</option>
                            <option value="chef">Chef</option>
                            <option value="waiter">Waiter</option>
                            <option value="admin">Admin</option>
                        </select>
                        </div>
                    ) : (
                        <span className="self-tag">Current Admin (You)</span>
                    )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    );
}

export default AdminUsers;
