import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Activity, Users, Package, ShieldOff, ArrowLeft, Network, ScanLine } from "lucide-react";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/logs", label: "Live logs", icon: Activity },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/blocked-ips", label: "Blocked IPs", icon: ShieldOff },
  { to: "/admin/meraki", label: "Meraki Monitor", icon: Network },
  { to: "/admin/portscan", label: "Port Scanner", icon: ScanLine },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-soc-bg text-soc-text font-body">
      <div className="flex">
        <aside className="w-60 shrink-0 border-r border-soc-border bg-soc-panel min-h-screen flex flex-col">
          <div className="px-5 py-5 border-b border-soc-border">
            <p className="font-display text-lg text-soc-text">
              Shop<span className="text-soc-green">Sec</span>
            </p>
            <p className="text-xs text-soc-muted font-mono mt-0.5">security operations</p>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-soc-panel2 text-soc-green"
                      : "text-soc-muted hover:text-soc-text hover:bg-soc-panel2"
                  }`
                }
              >
                <Icon size={16} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-3 border-t border-soc-border">
            <NavLink
              to="/"
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-soc-muted hover:text-soc-text transition-colors"
            >
              <ArrowLeft size={16} />
              Back to shop
            </NavLink>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

// import { NavLink, Outlet } from "react-router-dom";
// import { LayoutDashboard, Activity, Users, Package, ShieldOff, ArrowLeft } from "lucide-react";

// const navItems = [
//   { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
//   { to: "/admin/logs", label: "Live logs", icon: Activity },
//   { to: "/admin/users", label: "Users", icon: Users },
//   { to: "/admin/products", label: "Products", icon: Package },
//   { to: "/admin/blocked-ips", label: "Blocked IPs", icon: ShieldOff },
// ];

// export default function AdminLayout() {
//   return (
//     <div className="min-h-screen bg-soc-bg text-soc-text font-body">
//       <div className="flex">
//         <aside className="w-60 shrink-0 border-r border-soc-border bg-soc-panel min-h-screen flex flex-col">
//           <div className="px-5 py-5 border-b border-soc-border">
//             <p className="font-display text-lg text-soc-text">
//               Shop<span className="text-soc-green">Sec</span>
//             </p>
//             <p className="text-xs text-soc-muted font-mono mt-0.5">security operations</p>
//           </div>
//           <nav className="flex-1 px-3 py-4 space-y-1">
//             {navItems.map(({ to, label, icon: Icon, end }) => (
//               <NavLink
//                 key={to}
//                 to={to}
//                 end={end}
//                 className={({ isActive }) =>
//                   `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
//                     isActive
//                       ? "bg-soc-panel2 text-soc-green"
//                       : "text-soc-muted hover:text-soc-text hover:bg-soc-panel2"
//                   }`
//                 }
//               >
//                 <Icon size={16} />
//                 {label}
//               </NavLink>
//             ))}
//           </nav>
//           <div className="p-3 border-t border-soc-border">
//             <NavLink
//               to="/"
//               className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-soc-muted hover:text-soc-text transition-colors"
//             >
//               <ArrowLeft size={16} />
//               Back to shop
//             </NavLink>
//           </div>
//         </aside>
//         <main className="flex-1 min-w-0">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
