
const API = "https://jsonplaceholder.typicode.com/users";

/**
 * getPeople
 * - Hace GET a /users
 * - Devuelve un array de usuarios
 */
export async function getPeople() {
  const res = await fetch(API);
  if (!res.ok) throw new Error(`GET /users failed: ${res.status}`);
  return res.json();
}