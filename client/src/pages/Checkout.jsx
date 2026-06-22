import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, refreshCart } = useCart();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState({ line1: "", city: "", zip: "" });

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const total = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);

  async function placeOrder(e) {
    e.preventDefault();
    setPlacing(true);
    setError("");
    try {
      const { data } = await api.post("/orders/checkout");
      await refreshCart();
      navigate("/orders", { state: { justPlaced: data.order.id } });
    } catch (err) {
      setError(err.response?.data?.error || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center text-slate">
        Your cart is empty - there's nothing to check out yet.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Checkout</h1>
      <p className="text-sm text-slate mt-2">
        This is a demo checkout - no real payment is processed. Placing an order just creates an
        order record so you can see the full flow.
      </p>
      <div className="trace-divider my-6" />

      <form onSubmit={placeOrder} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Address line</label>
          <input
            required
            value={address.line1}
            onChange={(e) => setAddress({ ...address, line1: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring outline-none"
            placeholder="123 Market Street"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-ink mb-1">City</label>
            <input
              required
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring outline-none"
            />
          </div>
          <div className="w-28">
            <label className="block text-sm font-medium text-ink mb-1">ZIP</label>
            <input
              required
              value={address.zip}
              onChange={(e) => setAddress({ ...address, zip: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-ink/15 focus-ring outline-none"
            />
          </div>
        </div>

        <div className="trace-divider my-6" />

        <div className="flex items-center justify-between">
          <p className="font-display text-xl text-ink">Total due</p>
          <p className="font-mono text-xl text-indigo">${total.toFixed(2)}</p>
        </div>

        {error && <p className="text-sm text-coral">{error}</p>}

        <button
          type="submit"
          disabled={placing}
          className="w-full bg-ink text-paper py-3 rounded-full font-medium hover:bg-indigo transition-colors disabled:opacity-50"
        >
          {placing ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}
