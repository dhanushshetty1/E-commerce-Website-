import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="hero">
      <div className="pane card">
        <h2>Discover products you'll love</h2>
        <p>Browse our curated selection. Add to cart, checkout, and review — all in one sleek experience.</p>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <Link to="/products" className="btn" style={{ textDecoration: "none" }}>Shop now</Link>
          <Link to="/register" className="btn ghost" style={{ textDecoration: "none" }}>Create account</Link>
        </div>
      </div>
      <div className="pane card" style={{ minHeight: 220, display: "grid", placeItems: "center" }}>
        <div className="small">Tip: Press <span className="kbd">Ctrl</span> + <span className="kbd">K</span> to search on the products page.</div>
      </div>
    </div>
  );
}
