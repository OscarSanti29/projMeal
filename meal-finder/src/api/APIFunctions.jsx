const API = "https://www.themealdb.com/api/json/v1/1/";

export async function getMeal() {
  const res = await fetch(`${API}random.php`);
  if (!res.ok) {
    throw new Error(`HTTP error!! status: ${res.status}`);
  }
  return await res.json();
}

export async function getCategories() {
  const res = await fetch(`${API}categories.php`);
  if (!res.ok) {
    throw new Error(`HTTP Error!!: ${res.status}`);
  }
  return await res.json();
}

export async function getAreas() {
  const res = await fetch(`${API}list.php?a=list`);
  if (!res.ok) {
    throw new Error(`HTTP Error!!: ${res.status}`);
  }
  return await res.json();
}
