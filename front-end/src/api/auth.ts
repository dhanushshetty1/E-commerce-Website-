import { api } from "./client";

export type LoginRequest = { email: string; password: string };
export type RegisterRequest = { name?: string; email: string; password: string };

export type LoginResponse = {
  token: string;
  tokenType?: string;
  user?: { id: number | string; email: string; role?: string };
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/api/auth/login", body);
  return data;
}

export async function register(body: RegisterRequest): Promise<LoginResponse | unknown> {
  const { data } = await api.post("/api/auth/register", body);
  return data;
}
