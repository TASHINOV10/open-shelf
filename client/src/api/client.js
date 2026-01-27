import { API_BASE } from "../apiConfig";

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, options);

  const contentType = res.headers.get("content-type") || "";
  let body = null;

  try {
    if (contentType.includes("application/json")) {
      body = await res.json();
    } else {
      const text = await res.text();
      body = text ? text : null;
    }
  } catch {
    body = null;
  }

  if (!res.ok) {
    const detail =
      (body && typeof body === "object" && (body.detail || body.message)) ||
      (typeof body === "string" ? body : "") ||
      "Unknown error";

    throw new Error(`${res.status} ${res.statusText} — ${detail}`);
  }

  return body;
}
