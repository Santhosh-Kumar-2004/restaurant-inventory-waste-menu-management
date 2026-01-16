import { apiFetch } from "../api/http";

/**
 * Create a new dine-in order
 * Roles allowed: admin, waiter
 */
export function createOrder(data) {
  return apiFetch("/orders/", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Add item to an existing order
 */
export function addOrderItem(orderId, data) {
  return apiFetch(`/orders/${orderId}/items`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Generate invoice for an order
 */
export function generateInvoice(orderId) {
  return apiFetch(`/orders/${orderId}/invoice`, {
    method: "POST",
  });
}
