import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api/client";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const justPlaced = location.state?.justPlaced;

  useEffect(() => {
    api
      .get("/orders")
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-slate">Loading your orders...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Your orders</h1>
      {justPlaced && (
        <p className="mt-3 text-sm bg-soc-green/10 text-soc-green border border-soc-green/30 rounded-lg px-4 py-2 inline-block">
          Order #{justPlaced} placed successfully.
        </p>
      )}
      <div className="trace-divider my-6" />

      {orders.length === 0 ? (
        <p className="text-slate">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-ink/10 rounded-xl p-5 bg-white/60">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">Order #{order.id}</p>
                <p className="text-xs text-slate font-mono">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <p className="text-xs uppercase tracking-wide text-coral mt-1">{order.status}</p>
              <ul className="mt-3 space-y-1 text-sm text-ink/80">
                {order.items.map((item) => (
                  <li key={item.id} className="flex justify-between">
                    <span>
                      {item.quantity} x {item.product.name}
                    </span>
                    <span className="font-mono">${(item.quantity * item.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="trace-divider my-3" />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="font-mono text-indigo">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
