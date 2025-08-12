import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminProducts from "./pages/admin/AdminProducts";
import { useAuthStore } from "./store/auth";
import Home from "./pages/Home";

function Protected({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function AdminOnly({ children }: { children: JSX.Element }) {
  const { token, user } = useAuthStore();
  if (!token || user?.role !== "ROLE_ADMIN") return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div>
      <NavBar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Protected><Cart /></Protected>} />
          <Route path="/checkout" element={<Protected><Checkout /></Protected>} />
          <Route path="/orders/:id" element={<Protected><OrderConfirmation /></Protected>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/products" element={<AdminOnly><AdminProducts /></AdminOnly>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="footer">Made with ❤️ — MyStore Pro</footer>
    </div>
  );
}
