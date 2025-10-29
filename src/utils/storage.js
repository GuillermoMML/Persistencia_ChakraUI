// src/utils/storage.js
// Guardaremos 2 cosas en localStorage:
// 1) La lista de personas (array)  -> clave: "dew.people"
// 2) El texto del filtro (string)  -> clave: "dew.query"

const KEY_PEOPLE = "dew.people";
const KEY_QUERY  = "dew.query";

// Carga la lista guardada o null si no existe
export function loadPeople() {
  try {
    const raw = localStorage.getItem(KEY_PEOPLE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // ante cualquier error, devolvemos null
  }
}

// Guarda la lista (array) como JSON
export function savePeople(arr) {
  try {
    localStorage.setItem(KEY_PEOPLE, JSON.stringify(arr));
  } catch {}
}

// Carga el filtro (string). Si no hay, devuelve ""
export function loadQuery() {
  try {
    return localStorage.getItem(KEY_QUERY) || "";
  } catch {
    return "";
  }
}

// Guarda el filtro (string)
export function saveQuery(q) {
  try {
    localStorage.setItem(KEY_QUERY, q);
  } catch {}
}
