import { useState } from "react";
import { AlertCircle, CheckCircle2, FileUp, LockKeyhole, X } from "lucide-react";
import { getFaculty } from "../utils/facultyStorage";
import { getComplaints, saveComplaints } from "../utils/complaintStorage";

const categories = ["Infrastructure", "Electricity", "Water", "Internet / Network", "Classroom", "Laboratory", "Cleanliness", "Security", "Other"];
const priorities = ["Low", "Medium", "High", "Critical"];
const emptyForm = { category: "", location: "", description: "", priority: "", attachment: null };

export default function FacultyComplaint({ onClose }) {
  const [step, setStep] = useState("verify");
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [faculty, setFaculty] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const verifyFaculty = (event) => {
    event.preventDefault();
    const member = getFaculty().find((item) => item.id === credentials.username.trim());
    if (!member || member.password !== credentials.password) {
      setError("Invalid faculty ID or password.");
      return;
    }
    if (member.status !== "Active") {
      setError("This faculty account is inactive.");
      return;
    }
    setError("");
    setFaculty(member);
    setStep("form");
  };

  const submitComplaint = (event) => {
    event.preventDefault();
    if (!form.category || !form.location.trim() || !form.description.trim() || !form.priority) {
      setError("Complete all required complaint fields.");
      return;
    }
    const complaint = {
      id: `CMP-${String(Date.now()).slice(-6)}`,
      facultyId: faculty.id,
      facultyName: faculty.name,
      department: faculty.department,
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      priority: form.priority,
      attachmentName: form.attachment?.name || null,
      timestamp: new Date().toISOString(),
      status: "Submitted",
    };
    saveComplaints([complaint, ...getComplaints()]);
    setSuccess(complaint);
    setForm(emptyForm);
    setError("");
  };

  const updateField = (event) => {
    const { name, value, files } = event.target;
    setForm((previous) => ({ ...previous, [name]: files ? files[0] : value }));
  };

  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm"><div className="max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl">
    <div className="flex items-start justify-between border-b border-slate-700 p-6"><div><p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Faculty Access Only</p><h2 className="mt-1 text-2xl font-bold">Faculty Complaint Center</h2></div><button type="button" onClick={onClose} aria-label="Close complaint center" className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"><X size={20} /></button></div>
    {success ? <div className="p-8 text-center"><CheckCircle2 className="mx-auto text-emerald-400" size={52} /><h3 className="mt-4 text-2xl font-bold">Complaint submitted successfully</h3><p className="mt-2 text-slate-400">Ticket ID: <strong className="text-cyan-400">{success.id}</strong></p><button type="button" onClick={onClose} className="mt-6 rounded-xl bg-cyan-600 px-6 py-3 font-semibold">Done</button></div> : step === "verify" ? <form onSubmit={verifyFaculty} className="space-y-5 p-6 md:p-8"><div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-200">Only active registered faculty can submit complaints.</div><label className="block text-sm font-semibold text-slate-300">Faculty ID<input required value={credentials.username} onChange={(event) => setCredentials({ ...credentials, username: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /></label><label className="block text-sm font-semibold text-slate-300">Password<div className="relative mt-2"><LockKeyhole size={18} className="absolute left-3 top-3.5 text-slate-500" /><input required type="password" value={credentials.password} onChange={(event) => setCredentials({ ...credentials, password: event.target.value })} className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-10 pr-4" /></div></label>{error && <p className="flex items-center gap-2 text-sm text-red-300"><AlertCircle size={16} />{error}</p>}<button className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-semibold">Verify Faculty Access</button></form> : <form onSubmit={submitComplaint} className="grid gap-5 p-6 md:grid-cols-2 md:p-8"><div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4 text-sm md:col-span-2"><p className="font-semibold">{faculty.name}</p><p className="mt-1 text-slate-400">{faculty.id} · {faculty.department} · {faculty.email}</p></div><label className="text-sm font-semibold md:col-span-2">Building / Location<input required name="location" value={form.location} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /></label><label className="text-sm font-semibold">Category<select required name="category" value={form.category} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"><option value="">Select category</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-semibold">Priority<select required name="priority" value={form.priority} onChange={updateField} className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3"><option value="">Select priority</option>{priorities.map((item) => <option key={item}>{item}</option>)}</select></label><label className="text-sm font-semibold md:col-span-2">Description<textarea required name="description" value={form.description} onChange={updateField} rows="4" className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3" /></label><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-600 p-4 text-sm text-slate-400 md:col-span-2"><FileUp size={19} />{form.attachment?.name || "Optional attachment"}<input type="file" name="attachment" accept="image/*,.pdf" onChange={updateField} className="hidden" /></label>{error && <p className="flex items-center gap-2 text-sm text-red-300 md:col-span-2"><AlertCircle size={16} />{error}</p>}<button className="rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-semibold md:col-span-2">Submit Complaint</button></form>}
  </div></div>;
}
