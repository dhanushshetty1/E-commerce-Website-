import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { register, type RegisterRequest } from "../api/auth";

export default function Register() {
  const nav = useNavigate();
  const doRegister = useMutation({ mutationFn: register });
  const [form, setForm] = useState<RegisterRequest>({ name: "", email: "", password: "" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await doRegister.mutateAsync(form);
    nav("/login");
  }

  return (
    <form onSubmit={onSubmit} className="card pad" style={{ maxWidth: 460, margin: "0 auto" }}>
      <h2 style={{ marginTop: 0 }}>Create account</h2>
      <div className="field">
        <label>Name</label>
        <input placeholder="Your name" value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      </div>
      <div className="field" style={{ marginTop: 10 }}>
        <label>Email</label>
        <input placeholder="you@example.com" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="field" style={{ marginTop: 10 }}>
        <label>Password</label>
        <input placeholder="••••••••" type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} required />
      </div>
      <button disabled={doRegister.isPending} className="btn" style={{ marginTop: 14 }}>
        {doRegister.isPending ? "Creating…" : "Create account"}
      </button>
      {doRegister.isError && <p style={{ color: "var(--danger)", marginTop: 8 }}>Registration failed</p>}
    </form>
  );
}
