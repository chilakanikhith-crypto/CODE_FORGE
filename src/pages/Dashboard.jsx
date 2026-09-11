import React, {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  Users,
  Zap,
  Droplets,
  TriangleAlert,
  Activity,
  Brain,
  Wrench,
  ShieldAlert,
} from "lucide-react";

import { initialBuildings } from "../data/liveCampusData";
import { simulateLiveData } from "../data/simulateLiveData";

import ReportGenerator from "../components/ReportGenerator";
import HeroBanner from "../components/HeroBanner";
import LiveClock from "../components/LiveClock";
import DashboardLayout from "../components/DashboardLayout";
import KPICard from "../components/KPICard";

// USE logo.png
import logo from "../assets/logo.png";

const CampusMap = React.lazy(
  () => import("../components/CampusMaps")
);

const AIInsights = React.lazy(
  () => import("../components/AIInsights")
);

const EnergyChart = React.lazy(
  () => import("../components/EnergyChart")
);

const NotificationPanel = React.lazy(
  () => import("../components/NotificationPanel")
);

const AIAlertEngine = React.lazy(
  () => import("../components/AIAlertEngine")
);

const WeatherWidget = React.lazy(
  () => import("../components/WeatherWidget")
);

const HardwareSensors = React.lazy(
  () => import("../components/HardwareSensors")
);

const AlertCenter = React.lazy(
  () => import("../components/AlertCenter")
);

const StudentCountController = React.lazy(
  () => import("../components/StudentCountController")
);

const ComplaintManagement = React.lazy(
  () => import("../components/ComplaintManagement")
);

const FacultyManagement = React.lazy(
  () => import("../components/FacultyManagement")
);

import { getFaculty, subscribeToFaculty } from "../utils/facultyStorage";
import { getComplaints, subscribeToComplaints } from "../utils/complaintStorage";

// =====================================================
// PAGE LOADER
// =====================================================

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// =====================================================
// DASHBOARD
// =====================================================

export default function Dashboard({ onLogout, token }) {
  const [buildings, setBuildings] =
    useState(initialBuildings);

  const [loading, setLoading] =
    useState(true);

  const [darkMode, setDarkMode] =
    useState(true);

  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [selectedBuilding, setSelectedBuilding] =
    useState(initialBuildings[0]);

  // ===================================================
  // CAMPUS ALERTS STATE
  // ===================================================
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "electrical",
      level: "Critical",
      color: "border-red-500 bg-red-500/15",
      icon: "⚡",
      title: "Lab 3 High Current Surge",
      building: "Block 2 Substation",
      message:
        "SCT-013 CT hardware sensor read 18.4A (above nominal 12.0A limit). Electrical arcing risk detected in laboratory distribution panel.",
      time: "5 mins ago",
      status: "unacknowledged",
      resolved: false,
    },
    {
      id: 2,
      type: "overcrowding",
      level: "Warning",
      color: "border-yellow-500 bg-yellow-500/15",
      icon: "👥",
      title: "Block 1 High Occupancy",
      building: "Block 1 Main Block",
      message:
        "PIR optical beam sensors logged foot-traffic exceeding 85% of rated capacity. Automated ventilation activated.",
      time: "18 mins ago",
      status: "acknowledged",
      resolved: false,
    },
    {
      id: 3,
      type: "water",
      level: "Info",
      color: "border-cyan-500 bg-cyan-500/15",
      icon: "💧",
      title: "Underground Reservoir Refilled",
      building: "Block 4 Tank",
      message:
        "JSN-SR04T ultrasonic sensor confirmed water depth at 88% capacity. Automated inlet valve closed.",
      time: "45 mins ago",
      status: "acknowledged",
      resolved: false,
    },
  ]);

  const handleAddAlert = (newAlert) => {
    setAlerts((prev) => [newAlert, ...prev]);
    if (newAlert.building) {
      setBuildings((prev) =>
        prev.map((b) =>
          newAlert.building.toLowerCase().includes(b.name.toLowerCase())
            ? { ...b, status: newAlert.level === "Critical" ? "red" : "yellow" }
            : b
        )
      );
    }
  };

  const handleResolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };

  const handleAcknowledgeAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: "acknowledged" } : a))
    );
  };

  const handleClearAllAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, resolved: true })));
    setBuildings((prev) => prev.map((b) => ({ ...b, status: "green" })));
  };

  const handleUpdateBuildings = (newBuildings) => {
    setBuildings(newBuildings);
  };

  const handleIncrementStudent = () => {
    setBuildings((prev) =>
      prev.map((b, idx) => (idx === 0 ? { ...b, students: b.students + 1 } : b))
    );
  };

  // ===================================================
  // FACULTY & COMPLAINT METRICS
  // ===================================================
  const [facultyCount, setFacultyCount] = useState(() => getFaculty().length);
  const [openComplaints, setOpenComplaints] = useState(
    () =>
      getComplaints().filter(
        (complaint) => !["Resolved", "Rejected"].includes(complaint.status)
      ).length
  );

  useEffect(() => {
    const updateFacultyCount = (fac) => setFacultyCount(fac.length);
    const updateOpenComplaints = (comp) =>
      setOpenComplaints(
        comp.filter(
          (complaint) => !["Resolved", "Rejected"].includes(complaint.status)
        ).length
      );
    updateFacultyCount(getFaculty());
    updateOpenComplaints(getComplaints());
    const unsubscribeFaculty = subscribeToFaculty(updateFacultyCount);
    const unsubscribeComplaints = subscribeToComplaints(updateOpenComplaints);
    return () => {
      unsubscribeFaculty();
      unsubscribeComplaints();
    };
  }, []);

  // ===================================================
  // INITIAL LOADING
  // ===================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  // ===================================================
  // LIVE SENSOR DATA
  // ===================================================

  useEffect(() => {
    const interval = setInterval(() => {
      setBuildings((previousBuildings) => {
        const updatedBuildings =
          simulateLiveData(previousBuildings, false);

        const updatedSelected =
          updatedBuildings.find(
            (building) =>
              building.id ===
              selectedBuilding.id
          );

        if (updatedSelected) {
          setSelectedBuilding(
            updatedSelected
          );
        }

        return updatedBuildings;
      });
    }, 2000);

    return () =>
      clearInterval(interval);
  }, [selectedBuilding.id]);

  // ===================================================
  // MAP → AI ANALYTICS
  // ===================================================

  useEffect(() => {
    const handleOpenAnalytics = (event) => {
      const mapBuilding =
        event.detail;

      if (!mapBuilding) return;

      const realBuilding =
        buildings.find(
          (building) =>
            building.id ===
            mapBuilding.id
        );

      if (realBuilding) {
        setSelectedBuilding(
          realBuilding
        );
      }

      setActiveTab("ai");
    };

    window.addEventListener(
      "open-campus-analytics",
      handleOpenAnalytics
    );

    return () => {
      window.removeEventListener(
        "open-campus-analytics",
        handleOpenAnalytics
      );
    };
  }, [buildings]);

  // ===================================================
  // KPI VALUES
  // ===================================================

  const totalStudents =
    buildings.reduce(
      (sum, building) =>
        sum + Number(building.students || 0),
      0
    );

  const averageEnergy =
    buildings.length > 0
      ? Math.round(
          buildings.reduce(
            (sum, building) =>
              sum +
              parseInt(
                building.energy || 0
              ),
            0
          ) / buildings.length
        )
      : 0;

  const averageWater =
    buildings.length > 0
      ? Math.round(
          buildings.reduce(
            (sum, building) =>
              sum +
              parseInt(
                building.water || 0
              ),
            0
          ) / buildings.length
        )
      : 0;

  const totalAlerts = alerts.filter(
    (alert) => !alert.resolved
  ).length;

  // ===================================================
  // LOADING SCREEN
  // ===================================================

  if (loading) {
    return (
      <div
        className={`
          min-h-screen
          flex
          items-center
          justify-center
          transition-colors
          duration-500
          ${
            darkMode
              ? "bg-slate-950"
              : "bg-slate-100"
          }
        `}
      >
        <div className="text-center">

          <div className="w-20 h-20 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

          <h1 className="mt-8 text-4xl font-bold text-cyan-400">
            GRIET INTELLIGENT CAMPUS
          </h1>

          <p
            className={`
              mt-3
              ${
                darkMode
                  ? "text-slate-400"
                  : "text-slate-500"
              }
            `}
          >
            Initializing AI Digital Twin...
          </p>

        </div>
      </div>
    );
  }

  // ===================================================
  // MAIN
  // ===================================================

  return (
    <DashboardLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      darkMode={darkMode}
      setDarkMode={setDarkMode}
      onLogout={onLogout}
      isAdmin={true}
    >

      <div
        className={`
          relative
          min-h-screen
          overflow-hidden
          transition-colors
          duration-500
          ${
            darkMode
              ? "bg-slate-950"
              : "bg-gradient-to-br from-slate-100 via-sky-50 to-slate-200"
          }
        `}
      >

        {/* =================================================
            GRIET LOGO WALLPAPER
        ================================================= */}

        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center">

          <img
            src={logo}
            alt=""
            className={`
              w-[600px]
              h-[600px]
              object-contain
              select-none
              transition-opacity
              duration-500
              ${
                darkMode
                  ? "opacity-[0.28]"
                  : "opacity-[0.32]"
              }
            `}
          />

        </div>

        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

        <div className="relative z-10">

          {/* =================================================
              HERO
          ================================================= */}

          <HeroBanner darkMode={darkMode} />

          <div className="mb-6">
            <LiveClock darkMode={darkMode} />
          </div>

          {/* =================================================
              DASHBOARD OVERVIEW
          ================================================= */}

          {activeTab === "dashboard" && (

            <div className="space-y-8">

              {/* KPI CARDS */}

              <div
                className="
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-6
                  gap-5
                "
              >

                <div
                  onClick={() => setActiveTab("occupancy")}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  title="Click to open Dynamic Student Count Controller"
                >
                  <KPICard
                    title="Students / Intake"
                    value={totalStudents}
                    color="text-cyan-400"
                    status="Interactive Live"
                    icon={<Users size={40} />}
                    darkMode={darkMode}
                  />
                </div>

                <KPICard
                  title="Energy Usage"
                  value={`${averageEnergy}%`}
                  color="text-yellow-400"
                  status="Normal"
                  icon={<Zap size={40} />}
                  darkMode={darkMode}
                />

                <KPICard
                  title="Water Level"
                  value={`${averageWater}%`}
                  color="text-blue-400"
                  status="Healthy"
                  icon={<Droplets size={40} />}
                  darkMode={darkMode}
                />

                <div
                  onClick={() => setActiveTab("alerts")}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  title="Click to open Campus Alert Center"
                >
                  <KPICard
                    title="Alerts"
                    value={totalAlerts}
                    color="text-red-400"
                    status={totalAlerts > 0 ? "Attention Required" : "All Clear"}
                    icon={<TriangleAlert size={40} />}
                    darkMode={darkMode}
                  />
                </div>

                <div
                  onClick={() => setActiveTab("faculty")}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  title="Click to view Faculty Management"
                >
                  <KPICard
                    title="Total Faculty"
                    value={facultyCount}
                    color="text-emerald-400"
                    status="Registered"
                    icon={<Users size={40} />}
                    darkMode={darkMode}
                  />
                </div>

                <div
                  onClick={() => setActiveTab("complaints")}
                  className="cursor-pointer transition-transform hover:scale-[1.02]"
                  title="Click to view Faculty Complaints"
                >
                  <KPICard
                    title="Open Complaints"
                    value={openComplaints}
                    color="text-orange-400"
                    status={openComplaints > 0 ? "Needs Review" : "All Resolved"}
                    icon={<ShieldAlert size={40} />}
                    darkMode={darkMode}
                  />
                </div>

              </div>

              {/* WEATHER */}

              <Suspense fallback={<PageLoader />}>
                <WeatherWidget
                  darkMode={darkMode}
                />
              </Suspense>

              {/* OVERVIEW */}

              <div
                className={`
                  border
                  rounded-3xl
                  p-6
                  transition-colors
                  duration-300
                  ${
                    darkMode
                      ? "bg-slate-950 border-slate-700"
                      : "bg-white border-slate-200"
                  }
                `}
              >

                <div className="flex items-center gap-3 mb-6">

                  <Activity
                    className="text-cyan-400"
                    size={28}
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Campus Overview
                    </h2>

                    <p
                      className={`text-sm ${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Live GRIET INTELLIGENT CAMPUS status
                    </p>

                  </div>

                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-4
                  "
                >

                  {buildings.map(
                    (building) => (

                      <button
                        key={building.id}
                        onClick={() => {

                          setSelectedBuilding(
                            building
                          );

                          setActiveTab("ai");

                        }}
                        className={`
                          text-left
                          border
                          hover:border-cyan-400
                          rounded-2xl
                          p-5
                          transition-all
                          ${
                            darkMode
                              ? "bg-slate-800 hover:bg-slate-700 border-slate-700"
                              : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                          }
                        `}
                      >

                        <div className="flex items-center justify-between">

                          <div className="text-3xl">
                            {building.icon}
                          </div>

                          <span
                            className={`
                              w-3
                              h-3
                              rounded-full
                              ${
                                building.status ===
                                "red"
                                  ? "bg-red-500"
                                  : building.status ===
                                    "yellow"
                                  ? "bg-yellow-400"
                                  : "bg-green-500"
                              }
                            `}
                          />

                        </div>

                        <h3
                          className={`
                            text-lg
                            font-bold
                            mt-3
                            ${
                              darkMode
                                ? "text-white"
                                : "text-slate-900"
                            }
                          `}
                        >
                          {building.name}
                        </h3>

                        <p
                          className={`
                            text-sm
                            mt-1
                            ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-600"
                            }
                          `}
                        >
                          {building.students} students
                        </p>

                        <div className="mt-4 text-xs text-cyan-400">
                          View AI Analytics →
                        </div>

                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              CAMPUS TWIN
          ================================================= */}

          {activeTab === "campus" && (

            <Suspense fallback={<PageLoader />}>

              <CampusMap
                buildings={buildings}
                selectedBuilding={
                  selectedBuilding
                }
                setSelectedBuilding={
                  setSelectedBuilding
                }
                setActiveTab={
                  setActiveTab
                }
                onBuildingClick={(mapBuilding) => {

                  const realBuilding =
                    buildings.find(
                      (building) =>
                        building.id ===
                        mapBuilding.id
                    );

                  if (realBuilding) {
                    setSelectedBuilding(
                      realBuilding
                    );
                  }

                  setActiveTab("ai");

                }}
                darkMode={darkMode}
              />

            </Suspense>

          )}

          {/* =================================================
              OCCUPANCY
          ================================================= */}

          {activeTab === "occupancy" && (

            <div className="space-y-6">

              {/* DYNAMIC STUDENT CONTROLLER */}
              <Suspense fallback={<PageLoader />}>
                <StudentCountController
                  buildings={buildings}
                  onUpdateBuildings={handleUpdateBuildings}
                  darkMode={darkMode}
                  onTriggerAlert={handleAddAlert}
                />
              </Suspense>

              <div
                className={`
                  border
                  rounded-3xl
                  p-6
                  transition-colors
                  duration-300
                  ${
                    darkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-slate-200"
                  }
                `}
              >

                <div className="flex items-center gap-3 mb-6">

                  <Users
                    size={30}
                    className="text-cyan-400"
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Occupancy Analytics
                    </h2>

                    <p
                      className={`${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Live student occupancy by block
                    </p>

                  </div>

                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                  "
                >

                  {buildings.map(
                    (building) => {

                      const occupancy =
                        Math.min(
                          100,
                          Math.max(
                            0,
                            Number(
                              building.students || 0
                            )
                          )
                        );

                      return (

                        <div
                          key={building.id}
                          className={`
                            border
                            rounded-2xl
                            p-5
                            transition-colors
                            duration-300
                            ${
                              darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-slate-50 border-slate-200"
                            }
                          `}
                        >

                          <div className="flex justify-between">

                            <h3
                              className={`font-bold ${
                                darkMode
                                  ? "text-white"
                                  : "text-slate-900"
                              }`}
                            >
                              {building.name}
                            </h3>

                            <span className="text-cyan-400">
                              👥
                            </span>

                          </div>

                          <div className="text-4xl font-bold text-cyan-400 mt-5">
                            {building.students}
                          </div>

                          <p
                            className={`text-sm ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            Students Present
                          </p>

                          <div className="mt-5">

                            <div
                              className={`
                                h-3
                                rounded-full
                                overflow-hidden
                                ${
                                  darkMode
                                    ? "bg-slate-700"
                                    : "bg-slate-200"
                                }
                              `}
                            >

                              <div
                                className="
                                  h-full
                                  bg-cyan-400
                                  rounded-full
                                  transition-all
                                  duration-500
                                "
                                style={{
                                  width: `${occupancy}%`,
                                }}
                              />

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              ENERGY
          ================================================= */}

          {activeTab === "energy" && (

            <div className="space-y-6">

              <div
                className={`
                  border
                  rounded-3xl
                  p-6
                  transition-colors
                  duration-300
                  ${
                    darkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-slate-200"
                  }
                `}
              >

                <div className="flex items-center gap-3 mb-6">

                  <Zap
                    size={30}
                    className="text-yellow-400"
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Energy Analytics
                    </h2>

                    <p
                      className={`${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Live energy consumption
                    </p>

                  </div>

                </div>

                <Suspense fallback={<PageLoader />}>

                  <EnergyChart darkMode={darkMode} />

                </Suspense>

              </div>

            </div>

          )}

          {/* =================================================
              WATER
          ================================================= */}

          {activeTab === "water" && (

            <div className="space-y-6">

              <div
                className={`
                  border
                  rounded-3xl
                  p-6
                  transition-colors
                  duration-300
                  ${
                    darkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-slate-200"
                  }
                `}
              >

                <div className="flex items-center gap-3 mb-6">

                  <Droplets
                    size={30}
                    className="text-blue-400"
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Water Analytics
                    </h2>

                    <p
                      className={`${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Live water level by block
                    </p>

                  </div>

                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    md:grid-cols-2
                    xl:grid-cols-4
                    gap-5
                  "
                >

                  {buildings.map(
                    (building) => {

                      const water =
                        parseInt(
                          building.water || 0
                        );

                      return (

                        <div
                          key={building.id}
                          className={`
                            border
                            rounded-2xl
                            p-5
                            transition-colors
                            duration-300
                            ${
                              darkMode
                                ? "bg-slate-800 border-slate-700"
                                : "bg-slate-50 border-slate-200"
                            }
                          `}
                        >

                          <div className="flex justify-between">

                            <h3
                              className={`font-bold ${
                                darkMode
                                  ? "text-white"
                                  : "text-slate-900"
                              }`}
                            >
                              {building.name}
                            </h3>

                            <Droplets
                              size={22}
                              className="text-blue-400"
                            />

                          </div>

                          <div className="text-4xl font-bold text-blue-400 mt-5">
                            {building.water}
                          </div>

                          <p
                            className={`text-sm ${
                              darkMode
                                ? "text-slate-400"
                                : "text-slate-500"
                            }`}
                          >
                            Water Level
                          </p>

                          <div className="mt-5">

                            <div
                              className={`
                                h-3
                                rounded-full
                                overflow-hidden
                                ${
                                  darkMode
                                    ? "bg-slate-700"
                                    : "bg-slate-200"
                                }
                              `}
                            >

                              <div
                                className="
                                  h-full
                                  bg-blue-500
                                  rounded-full
                                  transition-all
                                  duration-500
                                "
                                style={{
                                  width:
                                    typeof building.water ===
                                    "string"
                                      ? building.water
                                      : `${water}%`,
                                }}
                              />

                            </div>

                          </div>

                        </div>

                      );

                    }
                  )}

                </div>

              </div>

            </div>

          )}

          {/* =================================================
              MAINTENANCE
          ================================================= */}

          {activeTab === "maintenance" && (

            <Suspense fallback={<PageLoader />}>

              <div className="mb-6">

                <div className="flex items-center gap-3 mb-5">

                  <Wrench
                    size={30}
                    className="text-purple-400"
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Maintenance
                    </h2>

                    <p
                      className={`${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Campus maintenance and notifications
                    </p>

                  </div>

                </div>

                <NotificationPanel
                  darkMode={darkMode}
                />

              </div>

            </Suspense>

          )}

          {/* =================================================
              HARDWARE PROTOTYPE LAB (STRICTLY HARDWARE)
          ================================================= */}

          {activeTab === "hardware" && (

            <Suspense fallback={<PageLoader />}>

              <HardwareSensors
                darkMode={darkMode}
                onTriggerAlert={handleAddAlert}
                onIncrementStudent={handleIncrementStudent}
              />

            </Suspense>

          )}

          {/* =================================================
              ALERT CENTER (SHOW DIFFERENT ALERTS & ACTIONS)
          ================================================= */}

          {activeTab === "alerts" && (

            <Suspense fallback={<PageLoader />}>

              <AlertCenter
                alerts={alerts}
                onAddAlert={handleAddAlert}
                onResolveAlert={handleResolveAlert}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onClearAllAlerts={handleClearAllAlerts}
                darkMode={darkMode}
              />

            </Suspense>

          )}

          {/* =================================================
              FACULTY COMPLAINTS
          ================================================= */}

          {activeTab === "complaints" && (

            <Suspense fallback={<PageLoader />}>

              <ComplaintManagement
                token={token}
                darkMode={darkMode}
              />

            </Suspense>

          )}

          {/* =================================================
              FACULTY MANAGEMENT
          ================================================= */}

          {activeTab === "faculty" && (

            <Suspense fallback={<PageLoader />}>

              <FacultyManagement
                token={token}
                darkMode={darkMode}
              />

            </Suspense>

          )}

          {/* =================================================
              EMERGENCY
          ================================================= */}

          {activeTab === "emergency" && (

            <Suspense fallback={<PageLoader />}>

              <div className="mb-6">

                <div className="flex items-center gap-3 mb-5">

                  <ShieldAlert
                    size={30}
                    className="text-red-400"
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      Emergency
                    </h2>

                    <p
                      className={`${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      AI-powered emergency alerts
                    </p>

                  </div>

                </div>

                <AIAlertEngine
                  darkMode={darkMode}
                />

              </div>

            </Suspense>

          )}

          {/* =================================================
              AI INSIGHTS
          ================================================= */}

          {activeTab === "ai" && (

            <Suspense fallback={<PageLoader />}>

              <div className="mb-6">

                <div className="flex items-center gap-3 mb-5">

                  <Brain
                    size={30}
                    className="text-green-400"
                  />

                  <div>

                    <h2
                      className={`text-2xl font-bold ${
                        darkMode
                          ? "text-white"
                          : "text-slate-900"
                      }`}
                    >
                      AI Insights
                    </h2>

                    <p
                      className={`${
                        darkMode
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      Live AI analysis for{" "}
                      {selectedBuilding?.name}
                    </p>

                  </div>

                </div>

                <AIInsights
                  buildings={buildings}
                  selectedBuilding={
                    selectedBuilding
                  }
                  darkMode={darkMode}
                />

              </div>

            </Suspense>

          )}

          {/* =================================================
              REPORT
          ================================================= */}

          <ReportGenerator
            buildings={buildings}
            darkMode={darkMode}
          />

        </div>

      </div>

    </DashboardLayout>
  );
}