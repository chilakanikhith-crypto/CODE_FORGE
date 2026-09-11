import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
    children,
    activeTab,
    setActiveTab,
    darkMode,
    setDarkMode,
    onLogout,
    isAdmin,
}) {
    return (
        <div
            className={`
                min-h-screen
                transition-colors
                duration-300
                ${
                    darkMode
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-900"
                }
            `}
        >
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                darkMode={darkMode}
                onLogout={onLogout}
                isAdmin={isAdmin}
            />

            <div className="ml-64">
                <Topbar
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                />

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}