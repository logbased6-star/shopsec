import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Orders from "./pages/Orders";
import Dashboard from "./pages/admin/Dashboard";
import Logs from "./pages/admin/Logs";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import BlockedIps from "./pages/admin/BlockedIps";
import MerakiMonitor from "./pages/admin/MerakiMonitor";
import PortScanner from "./pages/admin/PortScanner";

function StorefrontLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Admin mode - dark SOC dashboard, admin-only */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="logs" element={<Logs />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="blocked-ips" element={<BlockedIps />} />
        <Route path="meraki" element={<MerakiMonitor />} />
        <Route path="portscan" element={<PortScanner />} />
      </Route>

      {/* User mode - storefront */}
      <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
      <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
      <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
      <Route path="/register" element={<StorefrontLayout><Register /></StorefrontLayout>} />
      <Route
        path="/cart"
        element={
          <StorefrontLayout>
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          </StorefrontLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <StorefrontLayout>
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          </StorefrontLayout>
        }
      />
      <Route
        path="/orders"
        element={
          <StorefrontLayout>
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          </StorefrontLayout>
        }
      />
    </Routes>
  );
}


// import { Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminLayout from "./components/AdminLayout";

// import Home from "./pages/Home";
// import ProductDetail from "./pages/ProductDetail";
// import Cart from "./pages/Cart";
// import Checkout from "./pages/Checkout";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import Orders from "./pages/Orders";

// import Dashboard from "./pages/admin/Dashboard";
// import Logs from "./pages/admin/Logs";
// import AdminUsers from "./pages/admin/AdminUsers";
// import AdminProducts from "./pages/admin/AdminProducts";
// import BlockedIps from "./pages/admin/BlockedIps";

// function StorefrontLayout({ children }) {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Navbar />
//       <main className="flex-1">{children}</main>
//       <Footer />
//     </div>
//   );
// }

// export default function App() {
//   return (
//     <Routes>
//       {/* Admin mode - dark SOC dashboard, admin-only */}
//       <Route
//         path="/admin"
//         element={
//           <ProtectedRoute adminOnly>
//             <AdminLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route index element={<Dashboard />} />
//         <Route path="logs" element={<Logs />} />
//         <Route path="users" element={<AdminUsers />} />
//         <Route path="products" element={<AdminProducts />} />
//         <Route path="blocked-ips" element={<BlockedIps />} />
//       </Route>

//       {/* User mode - storefront */}
//       <Route path="/" element={<StorefrontLayout><Home /></StorefrontLayout>} />
//       <Route path="/product/:id" element={<StorefrontLayout><ProductDetail /></StorefrontLayout>} />
//       <Route path="/login" element={<StorefrontLayout><Login /></StorefrontLayout>} />
//       <Route path="/register" element={<StorefrontLayout><Register /></StorefrontLayout>} />
//       <Route
//         path="/cart"
//         element={
//           <StorefrontLayout>
//             <ProtectedRoute>
//               <Cart />
//             </ProtectedRoute>
//           </StorefrontLayout>
//         }
//       />
//       <Route
//         path="/checkout"
//         element={
//           <StorefrontLayout>
//             <ProtectedRoute>
//               <Checkout />
//             </ProtectedRoute>
//           </StorefrontLayout>
//         }
//       />
//       <Route
//         path="/orders"
//         element={
//           <StorefrontLayout>
//             <ProtectedRoute>
//               <Orders />
//             </ProtectedRoute>
//           </StorefrontLayout>
//         }
//       />
//     </Routes>
//   );
// }
