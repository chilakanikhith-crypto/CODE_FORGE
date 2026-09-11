const FACULTY_KEY = "smartcampus_faculty";
const FACULTY_EVENT = "smartcampus-faculty-updated";

const demoFaculty = {
  id: "1",
  name: "Demo Faculty",
  department: "CSE",
  email: "faculty@griet.example",
  password: "1234",
  status: "Active",
};

export function getFaculty() {
  const raw = window.localStorage.getItem(FACULTY_KEY);
  if (!raw) {
    saveFaculty([demoFaculty]);
    return [demoFaculty];
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return [demoFaculty];
    return parsed.map((member) => ({
      id: member.id || member.username,
      name: member.name || "Demo Faculty",
      department: member.department || "CSE",
      email: member.email || "faculty@griet.example",
      password: member.password || (member.id === "1" || member.username === "1" ? "1234" : ""),
      status: member.status || (member.active === false ? "Inactive" : "Active"),
    }));
  } catch {
    saveFaculty([demoFaculty]);
    return [demoFaculty];
  }
}

export function saveFaculty(faculty) {
  window.localStorage.setItem(FACULTY_KEY, JSON.stringify(faculty));
  window.dispatchEvent(new Event(FACULTY_EVENT));
  return faculty;
}

export function subscribeToFaculty(callback) {
  const handler = () => callback(getFaculty());
  window.addEventListener(FACULTY_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(FACULTY_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

export { FACULTY_KEY };
