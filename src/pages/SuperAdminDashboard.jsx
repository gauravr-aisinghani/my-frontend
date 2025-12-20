import { useEffect, useState } from "react";
import superAdminApi from "../api/superadminapi";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const [session, setSession] = useState(null);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    email: "",
    password: "",
    companyName: "",
    phone: ""
  });

  const navigate = useNavigate();

  // ---------------- CHECK SESSION ----------------
  const checkSession = async () => {
    try {
      const res = await superAdminApi.get("/auth/session-status");
      setSession(res.data);
    } catch {
      navigate("/super-admin");
    }
  };

  // ---------------- FETCH CLIENTS ----------------
  const loadClients = async () => {
    const res = await superAdminApi.get("/admin/clients");
    setClients(res.data);
  };

  useEffect(() => {
    checkSession();
    loadClients();
  }, []);

  // ---------------- LOGOUT ----------------
  const logout = async () => {
    await superAdminApi.post("/auth/logout");
    navigate("/super-admin");
  };

  // ---------------- CREATE CLIENT ----------------
  const createClient = async (e) => {
    e.preventDefault();
    try {
      await superAdminApi.post("/admin/clients", form);
      alert("Client Created!");

      setForm({ email: "", password: "", companyName: "", phone: "" });
      loadClients();
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // ---------------- DELETE CLIENT ----------------
  const deleteClient = async (id) => {
    if (!window.confirm("Delete this client?")) return;

    await superAdminApi.delete(`/admin/clients/${id}`);
    loadClients();
  };

  // ---------------- RESET PASSWORD ----------------
  const resetPassword = async (id) => {
    let newPass = prompt("Enter new password:");
    if (!newPass) return;

    await superAdminApi.put(`/admin/clients/${id}/reset-password?newPassword=${newPass}`);
    alert("Password reset!");
  };

  // ---------------- VERIFY / UNVERIFY CLIENT ----------------
  const toggleVerified = async (client) => {
    await superAdminApi.put(`/admin/clients/${client.id}`, {
      verified: !client.verified,
      email: client.email,
      companyName: client.companyName,
      phone: client.phone,
      role: client.role
    });

    loadClients();
  };

  if (!session) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Super Admin Dashboard 🚀</h2>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      <p className="mb-4 text-gray-700">
        Logged in as: <b>{session.user}</b>
      </p>

      {/* ---------------- CREATE CLIENT FORM ---------------- */}
      <div className="bg-white shadow rounded p-6 mb-10">
        <h3 className="text-xl font-semibold mb-4">Create New Client</h3>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={createClient}>
          
          <input
            className="border p-2 rounded"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Company Name"
            value={form.companyName}
            onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            required
          />

          <input
            className="border p-2 rounded"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <button
            type="submit"
            className="col-span-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Create Client
          </button>

        </form>
      </div>

      {/* ---------------- CLIENT TABLE ---------------- */}
      <div className="bg-white shadow rounded p-6 overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">All Clients</h3>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Company</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Verified</th>
              <th className="p-3 border">Role</th>
              <th className="p-3 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className="hover:bg-gray-50">
                <td className="p-3 border">{client.id}</td>
                <td className="p-3 border">{client.email}</td>
                <td className="p-3 border">{client.companyName}</td>
                <td className="p-3 border">{client.phone}</td>

                <td className="p-3 border">
                  <span className={`font-bold ${client.verified ? "text-green-600" : "text-red-600"}`}>
                    {client.verified ? "Verified" : "Not Verified"}
                  </span>
                  <br />

                  <button
                    onClick={() => toggleVerified(client)}
                    className="mt-2 px-2 py-1 text-sm bg-gray-700 text-white rounded hover:bg-gray-800"
                  >
                    {client.verified ? "Unverify" : "Verify"}
                  </button>
                </td>

                <td className="p-3 border">{client.role}</td>

                <td className="p-3 border space-y-2">
                  <button
                    onClick={() => resetPassword(client.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Reset Password
                  </button>

                  <button
                    onClick={() => deleteClient(client.id)}
                    className="ml-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}
