const COMPLAINT_KEY = "smartcampus_complaints";
const COMPLAINT_EVENT = "smartcampus-complaints-updated";

const demoComplaint = {
  id: "CMP-001",
  facultyId: "1",
  facultyName: "Demo Faculty",
  department: "CSE",
  category: "Water",
  location: "Block 1",
  priority: "High",
  description: "Water supply issue reported in the campus.",
  timestamp: new Date().toISOString(),
  status: "Submitted",
};

export function getComplaints() {
  const raw = window.localStorage.getItem(COMPLAINT_KEY);
  if (!raw) {
    saveComplaints([demoComplaint]);
    return [demoComplaint];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [demoComplaint];
  } catch {
    saveComplaints([demoComplaint]);
    return [demoComplaint];
  }
}

export function saveComplaints(complaints) {
  window.localStorage.setItem(COMPLAINT_KEY, JSON.stringify(complaints));
  window.dispatchEvent(new Event(COMPLAINT_EVENT));
  return complaints;
}

export function subscribeToComplaints(callback) {
  const handler = () => callback(getComplaints());
  window.addEventListener(COMPLAINT_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(COMPLAINT_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export { COMPLAINT_KEY };
