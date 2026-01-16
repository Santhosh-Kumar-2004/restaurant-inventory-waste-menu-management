import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/userService";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Admin – User Management</h2>

      {error && <p>{error}</p>}

      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Change Role</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {user.role !== "admin" && (
                  <select
                    value={user.role}
                    onChange={(e) =>
                      handleRoleChange(user.id, e.target.value)
                    }
                  >
                    <option value="user">User</option>
                    <option value="chef">Chef</option>
                    <option value="waiter">Waiter</option>
                  </select>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUsers;
