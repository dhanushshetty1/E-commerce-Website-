import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export default function NavBar() {
  const { token, user, logout } = useAuthStore();
  const nav = useNavigate();

  function out() {
    logout();
    nav("/login");
  }

  return (
    <header className="header">
      <Link to="/products" className="brand">
        <span className="dot"></span>
        <h1>MyStore Pro</h1>
      </Link>
      <nav className="nav">
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/cart">Cart</NavLink>
       {user?.role === "ROLE_ADMIN" && <NavLink to="/admin/products">Admin</NavLink>}
        {token ? (
          <>
            <span className="badge">{user?.email ?? "Signed in"}</span>
            <button className="btn secondary" onClick={out}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
}
