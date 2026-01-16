import { apiFetch } from "../api/http";

export function getAllUsers(adminEmail) {
  return apiFetch(`/users?email=${adminEmail}`);
}

export function updateUserRole(userId, role, adminEmail) {
  return apiFetch(`/users/${userId}/role?email=${adminEmail}`, {
    method: "PUT",
    body: JSON.stringify({ role })
  });
}
