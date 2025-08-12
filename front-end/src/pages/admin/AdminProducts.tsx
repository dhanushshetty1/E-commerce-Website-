import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listProducts, createProduct, updateProduct, deleteProduct, type Product } from "../../api/products";
import { useState } from "react";

export default function AdminProducts() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery<Product[]>({ queryKey: ["products"], queryFn: listProducts });

  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Partial<Product>>({ name: "", price: 0, description: "", imageUrl: "" });

  const createMut = useMutation({
    mutationFn: () => createProduct({ name: String(draft.name), price: Number(draft.price), description: draft.description, imageUrl: draft.imageUrl } as any),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setDraft({ name: "", price: 0, description: "", imageUrl: "" }); }
  });
  const updateMut = useMutation({
    mutationFn: () => updateProduct(Number(editing?.id), { name: draft.name!, price: Number(draft.price), description: draft.description, imageUrl: draft.imageUrl }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["products"] }); setEditing(null); }
  });
  const deleteMut = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] })
  });

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Failed to load products</p>;

  const startEdit = (p: Product) => {
    setEditing(p);
    setDraft({ name: p.name, price: p.price, description: p.description, imageUrl: p.imageUrl });
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card pad">
        <h3 style={{ marginTop: 0 }}>{editing ? "Edit product" : "Create product"}</h3>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="field">
            <label>Name</label>
            <input value={draft.name ?? ""} onChange={e => setDraft(d => ({ ...d, name: e.target.value }))} />
          </div>
          <div className="field">
            <label>Price</label>
            <input type="number" value={Number(draft.price)} onChange={e => setDraft(d => ({ ...d, price: Number(e.target.value) }))} />
          </div>
          <div className="field" style={{ gridColumn: "1/-1" }}>
            <label>Description</label>
            <textarea rows={3} value={draft.description ?? ""} onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
          </div>
          <div className="field" style={{ gridColumn: "1/-1" }}>
            <label>Image URL</label>
            <input value={draft.imageUrl ?? ""} onChange={e => setDraft(d => ({ ...d, imageUrl: e.target.value }))} />
          </div>
        </div>
        <div style={{ display:"flex", gap:10, marginTop: 12 }}>
          {editing ? (
            <>
              <button className="btn" onClick={() => updateMut.mutate()} disabled={updateMut.isPending}>Save</button>
              <button className="btn secondary" onClick={() => { setEditing(null); setDraft({ name: "", price: 0, description: "", imageUrl: "" }); }}>Cancel</button>
            </>
          ) : (
            <button className="btn" onClick={() => createMut.mutate()} disabled={createMut.isPending}>Create</button>
          )}
        </div>
      </div>

      <div className="card pad">
        <h3 style={{ marginTop: 0 }}>All products</h3>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th><th>Name</th><th>Price</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>₹{Number(p.price).toFixed(2)}</td>
                <td style={{ display:"flex", gap:8 }}>
                  <button className="btn secondary" onClick={() => startEdit(p)}>Edit</button>
                  <button className="btn secondary" onClick={() => deleteMut.mutate(p.id)} disabled={deleteMut.isPending}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
