import { useEffect, useState } from "react";
import api from "../../api/client";
import { useAuth } from "../../context/AuthContext";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function load() {
    setLoading(true);
    api
      .get("/admin/users")
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function toggleRole(u) {
    setError("");
    const role = u.role === "ADMIN" ? "USER" : "ADMIN";
    try {
      await api.patch(`/admin/users/${u.id}/role`, { role });
      load();
    } catch (err) {
      setError(err.response?.data?.error || "Could not update role.");
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-display text-2xl text-soc-text">Users</h1>
      <p className="text-sm text-soc-muted mt-1">
        Account metadata only - passwords are hashed and are never readable here.
      </p>
      {error && <p className="text-sm text-soc-red mt-3">{error}</p>}

      <div className="mt-6 bg-soc-panel border border-soc-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-soc-muted border-b border-soc-border">
              <th className="px-4 py-3 font-normal">Name</th>
              <th className="px-4 py-3 font-normal">Email</th>
              <th className="px-4 py-3 font-normal">Role</th>
              <th className="px-4 py-3 font-normal">Joined</th>
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
              users.map((u) => (
                <tr key={u.id} className="text-soc-text">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3 font-mono text-soc-muted">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-mono text-xs px-2 py-0.5 rounded-full border ${
                        u.role === "ADMIN"
                          ? "border-soc-green/40 text-soc-green"
                          : "border-soc-border text-soc-muted"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-soc-muted">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => toggleRole(u)}
                        className="text-xs font-mono text-soc-muted hover:text-soc-green border border-soc-border rounded px-2 py-1"
                      >
                        {u.role === "ADMIN" ? "Demote" : "Promote"}
                      </button>
                    )}
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
