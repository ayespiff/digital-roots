const API_BASE = "/api";

export const register = async (data: any) => {
  const res = await fetch(`${API_BASE}/register.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return res.json();
};

export const login = async (data: any) => {
  const res = await fetch(`${API_BASE}/login.php`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  return res.json();
};

export const logout = async () => {
  const res = await fetch(`${API_BASE}/logout.php`, {
    method: "POST",
    credentials: "include",
  });
  return res.json();
};
export const me = async () => {
  const res = await fetch(`${API_BASE}/me.php`, {
    credentials: "include",
  });

  if (!res.ok) {
    return { user: null };
  }

  return res.json();
};