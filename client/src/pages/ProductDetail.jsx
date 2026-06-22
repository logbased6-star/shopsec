import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data.product));
  }, [id]);

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    setStatus("adding");
    try {
      await api.post("/cart", { productId: product.id, quantity });
      await refreshCart();
      setStatus("added");
    } catch (err) {
      setStatus(err.response?.data?.error || "Could not add to cart.");
    }
  }

  if (!product) {
    return <div className="max-w-6xl mx-auto px-6 py-16 text-slate">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 gap-12">
      <div className="aspect-square rounded-2xl overflow-hidden bg-sand">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-coral">{product.category}</p>
        <h1 className="font-display text-3xl text-ink mt-2 leading-tight">{product.name}</h1>
        <p className="font-mono text-2xl text-indigo mt-4">${product.price.toFixed(2)}</p>
        <p className="text-slate mt-5 leading-relaxed">{product.description}</p>
        <p className="text-sm text-slate mt-4">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="mt-8 flex items-center gap-4">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            className="w-20 px-3 py-2 rounded-lg border border-ink/15 font-mono focus-ring outline-none"
          />
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || status === "adding"}
            className="flex-1 bg-ink text-paper py-3 rounded-full font-medium hover:bg-indigo transition-colors disabled:opacity-50"
          >
            {status === "adding" ? "Adding..." : "Add to cart"}
          </button>
        </div>

        {status === "added" && (
          <p className="mt-3 text-sm text-indigo">Added to your cart.</p>
        )}
        {status && status !== "adding" && status !== "added" && (
          <p className="mt-3 text-sm text-coral">{status}</p>
        )}
      </div>
    </div>
  );
}
