import { Link } from "react-router-dom";
import type { Product } from "../api/products";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link to={`/product/${p.id}`} className="card pad product-card" style={{ textDecoration: "none", color: "inherit" }}>
      <img src={p.imageUrl} alt={p.name} />
      <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
        <div style={{ fontWeight: 700 }}>{p.name}</div>
        <div className="price">₹{Number(p.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}
