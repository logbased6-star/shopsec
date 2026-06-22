import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import api from "../api/client";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, refreshCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart().finally(() => setLoading(false));
  }, [refreshCart]);

  async function updateQuantity(id, quantity) {
    if (quantity < 1) return;
    await api.put(`/cart/${id}`, { quantity });
    refreshCart();
  }

  async function removeItem(id) {
    await api.delete(`/cart/${id}`);
    refreshCart();
  }

  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-slate">Loading your cart...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Your cart</h1>
      <div className="trace-divider my-6" />

      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-slate mb-4">Your cart is empty.</p>
          <Link to="/" className="text-indigo font-medium hover:underline">
            Continue shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-white/60 border border-ink/10 rounded-xl p-4"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover bg-sand"
                />
                <div className="flex-1">
                  <p className="font-medium text-ink">{item.product.name}</p>
                  <p className="font-mono text-sm text-slate">${item.product.price.toFixed(2)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={item.product.stock}
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                  className="w-16 px-2 py-1.5 rounded-lg border border-ink/15 font-mono text-sm focus-ring outline-none"
                />
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-slate hover:text-coral p-2 -m-2 focus-ring rounded"
                  title="Remove"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="trace-divider my-6" />

          <div className="flex items-center justify-between">
            <p className="font-display text-xl text-ink">Total</p>
            <p className="font-mono text-xl text-indigo">${total.toFixed(2)}</p>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-6 w-full bg-ink text-paper py-3 rounded-full font-medium hover:bg-indigo transition-colors"
          >
            Proceed to checkout
          </button>
        </>
      )}
    </div>
  );
}
