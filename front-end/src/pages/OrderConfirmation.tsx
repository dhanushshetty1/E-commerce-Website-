import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getOrder, type Order } from "../api/orders";

export default function OrderConfirmation() {
  const { id } = useParams();
  const orderId = Number(id);
  const { data, isLoading, error } = useQuery<Order>({
    queryKey: ["order", orderId],
    queryFn: () => getOrder(orderId),
    enabled: Number.isFinite(orderId),
  });

  if (!Number.isFinite(orderId)) return <p>Invalid order id</p>;
  if (isLoading) return <p>Loading order…</p>;
  if (error || !data) return <p>Couldn’t load order.</p>;

  return (
    <div className="card pad">
      <h2 style={{ marginTop: 0 }}>Thanks for your purchase!</h2>
      <p>Order <b>#{data.id}</b> {data.status ? `— ${data.status}` : ""}</p>
      {typeof data.total === "number" && <p>Total: ₹{data.total.toFixed(2)}</p>}
      <div style={{ marginTop: 12 }}>
        <Link to="/products" className="btn secondary" style={{ textDecoration: "none" }}>Continue shopping</Link>
      </div>
    </div>
  );
}
