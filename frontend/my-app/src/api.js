export function getToken() {
  return localStorage.getItem("token");
}

export async function authFetch(url, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);

  // JSON body varsa content-type set et (FormData ise asla set etme)
  if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers });

  if (!res.ok) {
    const ct = res.headers.get("content-type") || "";
    let msg = `İstek başarısız (HTTP ${res.status})`;

    try {
      if (ct.includes("application/json")) {
        const j = await res.json();
        
        msg = j?.message || j?.error || msg;
      } else {
        const t = await res.text();
        msg = t || msg;
      }
    } catch {}

    throw new Error(msg);
  }

  return res;
}