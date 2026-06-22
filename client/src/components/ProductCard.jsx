import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block bg-white/60 border border-ink/10 rounded-2xl overflow-hidden hover:border-indigo/40 hover:shadow-lg transition-all"
    >
      <div className="aspect-square overflow-hidden bg-sand">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <p className="text-xs uppercase tracking-wide text-slate font-mono">{product.category}</p>
        <h3 className="font-display text-lg text-ink mt-1 leading-snug">{product.name}</h3>
        <p className="font-mono text-indigo mt-2">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  );
}
