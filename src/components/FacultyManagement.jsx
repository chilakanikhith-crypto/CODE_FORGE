import { useEffect, useState } from "react";
import { KeyRound, Trash2, UserCheck, UserPlus, UserX, Users } from "lucide-react";
import { getFaculty, saveFaculty, subscribeToFaculty } from "../utils/facultyStorage";

const initialForm = { name: "", facultyId: "", department: "", email: "", password: "", confirmPassword: "" };

export default function FacultyManagement({ darkMode }) {
  const [faculty, setFaculty] = useState(() => getFaculty());
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => subscribeToFaculty(setFaculty), []);

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (faculty.some((member) => member.id.toLowerCase() === form.facultyId.trim().toLowerCase())) {
      setError("Faculty ID must be unique.");
      return;
    }
    const next = [...faculty, {
      id: form.facultyId.trim(),
      name: form.name.trim(),
      department: form.department.trim(),
      email: form.email.trim(),
      password: form.password,
      status: "Active",
    }];
    saveFaculty(next);
    setForm(initialForm);
    setShowForm(false);
    setMessage("Faculty registered successfully.");
  };

  const toggleStatus = (member) => {
    saveFaculty(faculty.map((item) => item.id === member.id
      ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
      : item));
  };

  const remove = (member) => {
    if (window.confirm(`Remove ${member.name}'s faculty account?`)) {
      saveFaculty(faculty.filter((item) => item.id !== member.id));
    }
  };

  const resetPassword = (member) => {
    const password = window.prompt("Enter a new password (minimum 4 characters):");
    if (password && password.length >= 4) {
      saveFaculty(faculty.map((item) => item.id === member.id ? { ...item, password } : item));
      setMessage(`Password updated for ${member.name}.`);
    }
  };

  const surface = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
  const input = "mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-500";

  return <section className={`rounded-3xl border p-6 ${surface}`}>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-3"><Users className="text-cyan-400" size={28} /><div><h2 className="text-2xl font-bold">Faculty Management</h2><p className="text-sm text-slate-400">Total Faculty: {faculty.length} · Active Faculty: {faculty.filter((item) => item.status === "Active").length}</p></div></div>
      <button type="button" onClick={() => setShowForm((value) => !value)} className="flex items-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 font-semibold hover:bg-cyan-500"><UserPlus size={18} />{showForm ? "Cancel" : "+ Add Faculty"}</button>
    </div>
    {message && <p className="mb-4 text-sm text-emerald-400">{message}</p>}
    {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
    {showForm && <form onSubmit={submit} className="mb-8 grid gap-4 rounded-2xl border border-slate-700 bg-slate-800/50 p-5 md:grid-cols-2">
      {[["name", "Faculty Name", "text"], ["facultyId", "Faculty ID", "text"], ["department", "Department", "text"], ["email", "Email", "email"], ["password", "Password", "password"], ["confirmPassword", "Confirm Password", "password"]].map(([name, label, type]) => <label key={name} className="text-sm font-semibold text-slate-300">{label}<input required type={type} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} className={input} /></label>)}
      <button className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-semibold md:col-span-2">Create Faculty</button>
    </form>}
    <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-slate-700 text-slate-400"><tr><th className="p-3">Faculty ID</th><th className="p-3">Name</th><th className="p-3">Department</th><th className="p-3">Email</th><th className="p-3">Status</th><th className="p-3">Actions</th></tr></thead><tbody>{faculty.map((member) => <tr key={member.id} className="border-b border-slate-800"><td className="p-3 font-semibold">{member.id}</td><td className="p-3">{member.name}</td><td className="p-3 text-slate-400">{member.department}</td><td className="p-3 text-slate-400">{member.email}</td><td className={`p-3 ${member.status === "Active" ? "text-emerald-400" : "text-slate-500"}`}>{member.status}</td><td className="flex gap-2 p-3"><button type="button" title="Activate/Deactivate" onClick={() => toggleStatus(member)} className="rounded-lg border border-slate-700 p-2 hover:border-cyan-400">{member.status === "Active" ? <UserX size={16} /> : <UserCheck size={16} />}</button><button type="button" title="Change Password" onClick={() => resetPassword(member)} className="rounded-lg border border-slate-700 p-2 hover:border-cyan-400"><KeyRound size={16} /></button><button type="button" title="Delete" onClick={() => remove(member)} className="rounded-lg border border-red-500/30 p-2 text-red-400 hover:bg-red-500/10"><Trash2 size={16} /></button></td></tr>)}</tbody></table></div>
  </section>;
}
