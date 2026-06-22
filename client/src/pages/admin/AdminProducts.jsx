import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import api from "../../api/client";

const emptyForm = { name: "", description: "", price: "", category: "", image: "", stock: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/products")
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  }

  function openEdit(p) {
    setForm({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      image: p.image,
      stock: p.stock,
    });
    setEditingId(p.id);
    setShowForm(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await api.put(`/admin/products/${editingId}`, form);
      } else {
        await api.post("/admin/products", form);
      }
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not save product.");
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/admin/products/${id}`);
    load();
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-soc-text">Products</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 text-sm font-medium bg-soc-green text-soc-bg px-4 py-2 rounded-full hover:opacity-90"
        >
          <Plus size={16} />
          New product
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-soc-panel border border-soc-border rounded-xl p-5 grid sm:grid-cols-2 gap-4"
        >
          <div className="sm:col-span-2 flex items-center justify-between">
            <p className="text-sm text-soc-muted">{editingId ? "Edit product" : "New product"}</p>
            <button type="button" onClick={() => setShowForm(false)} className="text-soc-muted hover:text-soc-text">
              <X size={18} />
            </button>
          </div>
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-green/50"
          />
          <input
            required
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-green/50"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-green/50"
          />
          <input
            type="number"
            placeholder="Stock"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
            className="bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-green/50"
          />
          <input
            placeholder="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="sm:col-span-2 bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-green/50"
          />
          <textarea
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="sm:col-span-2 bg-soc-bg border border-soc-border rounded-lg px-3 py-2 text-sm text-soc-text outline-none focus:border-soc-green/50"
          />
          {error && <p className="sm:col-span-2 text-sm text-soc-red">{error}</p>}
          <button
            type="submit"
            className="sm:col-span-2 bg-soc-green text-soc-bg py-2.5 rounded-lg font-medium hover:opacity-90"
          >
            {editingId ? "Save changes" : "Create product"}
          </button>
        </form>
      )}

      <div className="mt-6 bg-soc-panel border border-soc-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-soc-muted border-b border-soc-border">
              <th className="px-4 py-3 font-normal">Product</th>
              <th className="px-4 py-3 font-normal">Category</th>
              <th className="px-4 py-3 font-normal">Price</th>
              <th className="px-4 py-3 font-normal">Stock</th>
              <th className="px-4 py-3 font-normal"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-soc-border/60">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-soc-muted">
                  Loading...
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="text-soc-text">
                  <td className="px-4 py-3">{p.name}</td>
                  <td className="px-4 py-3 text-soc-muted font-mono text-xs">{p.category}</td>
                  <td className="px-4 py-3 font-mono">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono">{p.stock}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => openEdit(p)} className="text-soc-muted hover:text-soc-green">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="text-soc-muted hover:text-soc-red">
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
