import { apiFetch } from "../api/http";

export function loginUser(data) {
  return apiFetch("/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function createUser(data) {
  return apiFetch("/users", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
