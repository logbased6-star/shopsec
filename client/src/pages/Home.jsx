import { useEffect, useState } from "react";
import api from "../api/client";
import ProductCard from "../components/ProductCard";
import { Search } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .get("/products", { params: { category, search } })
      .then(({ data }) => {
        if (!active) return;
        setProducts(data.products);
        setCategories(data.categories);
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [category, search]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="max-w-xl">
        <p className="font-mono text-xs uppercase tracking-widest text-coral">New arrivals, every category</p>
        <h1 className="font-display text-4xl sm:text-5xl text-ink mt-3 leading-tight">
          Good gear, plainly priced.
        </h1>
        <p className="text-slate mt-3">
          Electronics, fashion, home, and books — picked for everyday use, not just the photo.
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {["all", ...categories].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                category === c
                  ? "bg-ink text-paper border-ink"
                  : "border-ink/15 text-ink/70 hover:border-ink/40"
              }`}
            >
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products"
            className="w-full pl-9 pr-3 py-2 rounded-full border border-ink/15 bg-white/70 text-sm focus-ring outline-none"
          />
        </div>
      </div>

      <div className="trace-divider my-8" />

      {loading ? (
        <p className="text-slate">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-slate">No products match that search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
