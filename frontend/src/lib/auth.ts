let API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// No browser, o nome do serviço docker "backend" não resolve.
// Precisamos usar "localhost" se estivermos no cliente.
if (typeof window !== "undefined" && API_URL.includes("backend")) {
  API_URL = API_URL.replace("backend", "localhost");
}

export interface AuthData {
  access_token: string;
  id: number;
  nome: string;
  email: string;
  tipo: string;
}

export function saveAuthData(data: AuthData) {
  if (typeof window !== "undefined") {
    localStorage.setItem("viaje-bem-token", data.access_token);
    localStorage.setItem("viaje-bem-user", JSON.stringify({
      id: data.id,
      nome: data.nome,
      email: data.email,
      tipo: data.tipo
    }));
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("viaje-bem-token");
  }
  return null;
}

export function getAuthUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("viaje-bem-user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("viaje-bem-token");
    localStorage.removeItem("viaje-bem-user");
    window.location.href = "/login";
  }
}

export { API_URL };
