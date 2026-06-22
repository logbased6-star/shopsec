import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ShieldCheck, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-2xl tracking-tight text-ink">
          Shop<span className="text-indigo">Sec</span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-ink/80">
          <Link to="/" className="hover:text-indigo transition-colors">
            Shop
          </Link>
          {user && (
            <Link to="/orders" className="hover:text-indigo transition-colors">
              My orders
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 hover:text-indigo transition-colors"
            >
              <ShieldCheck size={16} />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative p-2 -m-2 focus-ring rounded">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-coral text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-mono">
                {itemCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:flex items-center gap-1.5 text-sm text-ink/70">
                <UserIcon size={15} />
                {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="p-2 -m-2 focus-ring rounded text-ink/60 hover:text-coral transition-colors"
                title="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-full hover:bg-indigo transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
      <div className="trace-divider" />
    </header>
  );
}
