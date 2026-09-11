import { useEffect, useState } from "react";
import { AlertTriangle, ClipboardList } from "lucide-react";
import { getComplaints, saveComplaints, subscribeToComplaints } from "../utils/complaintStorage";

const statuses = ["Submitted", "Acknowledged", "In Progress", "Resolved", "Rejected"];

export default function ComplaintManagement({ darkMode }) {
  const [complaints, setComplaints] = useState(() => getComplaints());
  const [detailsId, setDetailsId] = useState(null);
  const [filters, setFilters] = useState({ category: "", priority: "", location: "" });

  useEffect(() => subscribeToComplaints(setComplaints), []);

  const filtered = complaints.filter((item) =>
    (!filters.category || item.category === filters.category) &&
    (!filters.priority || item.priority === filters.priority) &&
    (!filters.location || item.location.toLowerCase().includes(filters.location.toLowerCase()))
  );

  const updateStatus = (id, status) => {
    saveComplaints(complaints.map((item) => item.id === id ? { ...item, status } : item));
  };

  const openCount = complaints.filter((item) => !["Resolved", "Rejected"].includes(item.status)).length;
  const surface = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";

  return <section className={`rounded-3xl border p-6 ${surface}`}>
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3"><ClipboardList className="text-cyan-400" size={28} /><div><h2 className="text-2xl font-bold">Faculty Complaints</h2><p className="text-sm text-slate-400">{openCount} open complaint{openCount === 1 ? "" : "s"}</p></div></div>
      <div className="flex flex-wrap gap-2">{["category", "priority"].map((name) => <select key={name} value={filters[name]} onChange={(event) => setFilters({ ...filters, [name]: event.target.value })} className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm"><option value="">All {name}</option>{[...new Set(complaints.map((item) => item[name]))].map((value) => <option key={value}>{value}</option>)}</select>)}<input value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="Filter location" className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm" /></div>
    </div>
    <div className="space-y-3">{filtered.map((complaint) => <article key={complaint.id} className={`rounded-2xl border p-4 ${["High", "Critical"].includes(complaint.priority) ? "border-red-500/60 bg-red-500/10" : "border-slate-700 bg-slate-800/50"}`}>
      <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex items-center gap-2 font-semibold">{["High", "Critical"].includes(complaint.priority) && <AlertTriangle size={17} className="text-red-400" />}{complaint.id} · {complaint.category}</div><p className="mt-1 text-sm text-slate-300">{complaint.facultyName} ({complaint.facultyId}) · {complaint.department} · {complaint.location}</p></div><div className="flex items-center gap-2"><button type="button" onClick={() => setDetailsId(detailsId === complaint.id ? null : complaint.id)} className="rounded-lg border border-slate-600 px-3 py-2 text-xs hover:border-cyan-400">{detailsId === complaint.id ? "Hide Details" : "View Details"}</button><select value={complaint.status} onChange={(event) => updateStatus(complaint.id, event.target.value)} className="rounded-lg border border-slate-600 bg-slate-950 px-2 py-2 text-sm">{statuses.map((status) => <option key={status}>{status}</option>)}</select></div></div>
      <p className="mt-3 text-sm text-slate-400">{complaint.description}</p><p className="mt-3 text-xs text-slate-500">{new Date(complaint.timestamp).toLocaleString()} · Priority: {complaint.priority}</p>
      {detailsId === complaint.id && <div className="mt-3 grid gap-2 rounded-xl border border-slate-700 bg-slate-950/50 p-3 text-xs text-slate-400 md:grid-cols-2"><span>Complaint ID: {complaint.id}</span><span>Faculty ID: {complaint.facultyId}</span><span>Department: {complaint.department}</span><span>Location: {complaint.location}</span><span>Priority: {complaint.priority}</span><span>Status: {complaint.status}</span></div>}
    </article>)}</div>
    {!filtered.length && <p className="py-10 text-center text-slate-500">No complaints match the current filters.</p>}
  </section>;
}
