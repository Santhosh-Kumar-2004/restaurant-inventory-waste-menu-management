import { apiFetch } from "../api/http";

export function loginUser(data) {
  return apiFetch("/users/login", {
    method: "POST",
    body: JSON.stringify(data)
  });
}

export function createUser(data) {
  return apiFetch("/users/users", {
    method: "POST",
    body: JSON.stringify(data)
  });
}
