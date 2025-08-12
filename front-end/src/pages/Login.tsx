import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login, type LoginRequest } from "../api/auth";
import { useAuthStore } from "../store/auth";

export default function Login() {
  const nav = useNavigate();
  const doLogin = useMutation({ mutationFn: login });
  const setAuth = useAuthStore((s) => s.login);

  const [form, setForm] = useState<LoginRequest>({ email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await doLogin.mutateAsync(form);
    setAuth(res.token, res.user);
    nav("/products");
  }

  return (
    <form onSubmit={onSubmit} className="card pad" style={{ maxWidth: 460, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Login</h2>
      <div className="field">
        <label>Email</label>
        <input placeholder="you@example.com" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="field" style={{ marginTop: 10 }}>
        <label>Password</label>
        <input placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
      </div>
      <button disabled={doLogin.isPending} className="btn" style={{ marginTop: 14 }}>
        {doLogin.isPending ? "Signing in…" : "Login"}
      </button>
      {doLogin.isError && <p style={{ color: "var(--danger)", marginTop: 8 }}>Login failed</p>}
    </form>
  );
}
