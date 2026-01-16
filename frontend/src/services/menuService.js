import { apiFetch } from "../api/http";

// Create a new menu item (admin)
export function createMenuItem(data) {
  return apiFetch("/menu", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// Get all menu items (admin view)
export function getMenuItems() {
  return apiFetch("/menu");
}

// Toggle availability (admin)
export function toggleMenuItem(itemId) {
  return apiFetch(`/menu/${itemId}/toggle`, {
    method: "PUT",
  });
}
