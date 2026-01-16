import { apiFetch } from "../api/http";

export function createInventoryItem(data) {
  return apiFetch("/inventory/items", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function getInventoryReport() {
  return apiFetch("/reports/inventory");
}
