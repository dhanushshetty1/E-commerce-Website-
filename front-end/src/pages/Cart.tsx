import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCart, removeFromCart, clearCart, type Cart, type CartItem } from "../api/cart";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

function asItems(data: Cart | CartItem[] | null | undefined): CartItem[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if ("items" in data && Array.isArray(data.items)) return data.items;
  return [];
}

function linePrice(it: CartItem): number {
  const unit = Number(it.price ?? it.product?.price ?? 0);
  const qty = Number(it.quantity ?? 1);
  const total = Number(it.total ?? unit * qty);
  return Number.isFinite(total) ? total : 0;
}

export default function Cart() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id ?? null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cart", userId],
    queryFn: () => getCart(Number(userId)),
    enabled: !!userId,
  });

  const removeMut = useMutation({
    mutationFn: (productId: number) => removeFromCart(Number(userId), productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
  });

  const clearMut = useMutation({
    mutationFn: () => clearCart(Number(userId)),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart", userId] }),
  });

  if (!userId) return <p>Please <Link to="/login">login</Link> to view your cart.</p>;
  if (isLoading) return <p>Loading cart…</p>;
  if (error) return <p>Failed to load cart.</p>;

  const items = asItems(data);
  const subtotal =
    (data && !Array.isArray(data) && "totalPrice" in data ? (data as Cart).totalPrice : undefined) ??
    items.reduce((sum, it) => sum + linePrice(it), 0);

  return (
    <div className="grid" style={{ gap: 16 }}>
      {items.length === 0 ? (
        <div className="card pad">
          Cart is empty. <Link to="/products">Browse products</Link>
        </div>
      ) : (
        <>
          <div className="card pad">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it, idx) => {
                  const pid = Number(it.productId ?? it.product?.id ?? 0);
                  const name = it.product?.name ?? `Product #${pid || idx + 1}`;
                  const qty = Number(it.quantity ?? 1);
                  const price = linePrice(it);
                  const img = it.product?.imageUrl;
                  return (
                    <tr key={pid || idx}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {img ? <img src={img} alt={name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 60, height: 60, background:"#0f1322", borderRadius: 8 }} />}
                          <div>
                            <div style={{ fontWeight: 600 }}>{name}</div>
                            <div className="small">#{pid}</div>
                          </div>
                        </div>
                      </td>
                      <td>{qty}</td>
                      <td className="price">₹{price.toFixed(2)}</td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn secondary" onClick={() => removeMut.mutate(pid)} disabled={removeMut.isPending}>
                          {removeMut.isPending ? "Removing…" : "Remove"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="card pad" style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              Subtotal: <span className="price">₹{Number(subtotal).toFixed(2)}</span>
            </div>
            <div style={{ display:"flex", gap:10 }}>
              <button className="btn secondary" onClick={() => clearMut.mutate()} disabled={clearMut.isPending}>
                {clearMut.isPending ? "Clearing…" : "Clear cart"}
              </button>
              <button className="btn" onClick={() => nav("/checkout")}>Proceed to Checkout</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
