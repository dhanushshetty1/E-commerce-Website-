import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProduct, type Product } from "../api/products";
import { addToCart } from "../api/cart";
import { listReviews, addReview, type Review } from "../api/reviews";
import { useAuthStore } from "../store/auth";
import { useState } from "react";
import Toast from "../components/Toast";

export default function ProductDetail() {
  const { id } = useParams();
  const productId = Number(id);
  const nav = useNavigate();
  const qc = useQueryClient();
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const [toast, setToast] = useState<string | null>(null);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["product", productId],
    queryFn: () => getProduct(productId),
    enabled: Number.isFinite(productId),
  });

  const { data: reviews } = useQuery<Review[]>({
    queryKey: ["reviews", productId],
    queryFn: () => listReviews(productId),
    enabled: Number.isFinite(productId),
  });

  const addMut = useMutation({
    mutationFn: () => {
      if (!userId) throw new Error("not-authed");
      return addToCart(Number(userId), productId);
    },
    onSuccess: () => {
      if (userId) qc.invalidateQueries({ queryKey: ["cart", userId] });
      setToast("Added to cart ✅");
      setTimeout(() => setToast(null), 1500);
    },
  });

  const reviewMut = useMutation({
    mutationFn: (vars: { rating: number; comment: string }) => addReview({ productId, ...vars }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", productId] });
      setToast("Review submitted 🙌");
      setComment(""); setRating(5);
    }
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  if (!Number.isFinite(productId)) return <p>Invalid product id</p>;
  if (isLoading) return <p>Loading…</p>;
  if (error || !product) return <p>Failed to load product</p>;

  function handleAdd() {
    if (!userId) {
      nav("/login");
      return;
    }
    addMut.mutate();
  }

  const price = typeof product.price === "number" ? product.price : Number(product.price);

  return (
    <div className="grid" style={{ gap: 20 }}>
      {toast && <Toast message={toast} />}
      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card pad">
          <img src={product.imageUrl} alt={product.name} style={{ width:"100%", height: 360, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,.08)" }} />
        </div>
        <div className="card pad">
          <h2 style={{ margin: 0 }}>{product.name}</h2>
          <div className="price" style={{ fontSize: 24, marginTop: 6 }}>₹{price?.toFixed?.(2) ?? price}</div>
          <p style={{ opacity: .85, marginTop: 10 }}>{product.description}</p>
          <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
            <button className="btn" onClick={handleAdd} disabled={addMut.isPending}>
              {addMut.isPending ? "Adding…" : "Add to Cart"}
            </button>
            <button className="btn secondary" onClick={() => window.history.back()}>Back</button>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div className="card pad">
          <h3 style={{ marginTop: 0 }}>Reviews</h3>
          <hr className="sep" />
          {reviews?.length ? (
            <div className="grid" style={{ gap: 10 }}>
              {reviews.map(r => (
                <div key={r.id} className="card pad" style={{ background:"#0f1322" }}>
                  <div style={{ display:"flex", justifyContent:"space-between" }}>
                    <div>Rating: {r.rating}⭐</div>
                    <div className="small">{r.createdAt?.slice(0,10)}</div>
                  </div>
                  <div style={{ marginTop: 6 }}>{r.comment}</div>
                  <div className="small" style={{ marginTop: 4 }}>{r.authorEmail}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="small">No reviews yet.</p>
          )}
        </div>
        <div className="card pad">
          <h3 style={{ marginTop: 0 }}>Add a review</h3>
          {!userId && <p className="small">Please login to post a review.</p>}
          <div className="field" style={{ marginTop: 10 }}>
            <label>Rating</label>
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Comment</label>
            <textarea rows={4} value={comment} onChange={e => setComment(e.target.value)} placeholder="Share your experience…" />
          </div>
          <button className="btn" style={{ marginTop: 12 }} disabled={!userId || reviewMut.isPending || !comment.trim()} onClick={() => reviewMut.mutate({ rating, comment })}>
            {reviewMut.isPending ? "Submitting…" : "Submit review"}
          </button>
        </div>
      </div>
    </div>
  );
}
