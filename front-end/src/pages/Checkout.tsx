import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { checkout, pay } from "../api/orders";

export default function Checkout() {
  const userId = useAuthStore((s) => s.user?.id ?? null);
  const nav = useNavigate();

  const payMut = useMutation({
    mutationFn: async () => {
      const order = await checkout(Number(userId));
      await pay(order.id);
      return order.id;
    },
    onSuccess: (orderId) => {
      nav(`/orders/${orderId}`, { replace: true });
    },
  });

  if (!userId) return <p>Please sign in first.</p>;

  return (
    <div className="card pad">
      <h2 style={{ marginTop: 0 }}>Checkout</h2>
      <p className="small">This creates an order and calls the payment endpoint on your backend.</p>
      <button className="btn" onClick={() => payMut.mutate()} disabled={payMut.isPending}>
        {payMut.isPending ? "Processing…" : "Pay now"}
      </button>
      {payMut.isError && <p style={{ color: "var(--danger)", marginTop: 10 }}>Payment failed.</p>}
    </div>
  );
}
