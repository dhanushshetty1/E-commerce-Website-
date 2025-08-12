import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listProducts, type Product } from "../api/products";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: listProducts,
  });
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter(p => p.name.toLowerCase().includes(term) || (p.description ?? "").toLowerCase().includes(term));
  }, [q, data]);

  if (isLoading) return <p>Loading products…</p>;
  if (error) return <p>Failed to load products</p>;

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="searchbar">
        <input placeholder="Search products…" value={q} onChange={e => setQ(e.target.value)} />
        <span className="small">Found {filtered.length}</span>
      </div>
      <div className="grid products">
        {filtered.map(p => <ProductCard key={p.id} p={p} />)}
      </div>
    </div>
  );
}
