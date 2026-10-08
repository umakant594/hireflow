import { useEffect, useState } from "react";

import {
  BarChart3,
  BriefcaseBusiness,
  CalendarDays,
  Plus,
  Search,
  Users,
} from "lucide-react";

import {
  HashRouter,
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import api from "./services/api";

import Jobs from "./pages/Jobs";
import Candidates from "./pages/Candidates";
import { Applications } from "./pages/Applications";
import { Interviews } from "./pages/Interviews";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import DashboardPage from "./pages/Dashboard";
/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const [stats, setStats] = useState({
    openJobs: 0,
    candidates: 0,
    applications: 0,
    interviews: 0,
    offers: 0,
    pipeline: {
      applied: 0,
      screening: 0,
      interview: 0,
      offer: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => {
        setStats(res.data);
      })
      .catch((error) => {
        console.error("Failed to load dashboard:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalApplications = stats.applications;

  const appliedWidth =
    totalApplications > 0
      ? `${Math.min(
          (stats.pipeline.applied / totalApplications) * 100,
          100
        )}%`
      : "0%";

  const screeningWidth =
    totalApplications > 0
      ? `${Math.min(
          (stats.pipeline.screening / totalApplications) * 100,
          100
        )}%`
      : "0%";

  const interviewWidth =
    totalApplications > 0
      ? `${Math.min(
          (stats.pipeline.interview / totalApplications) * 100,
          100
        )}%`
      : "0%";

  const offerWidth =
    totalApplications > 0
      ? `${Math.min(
          (stats.pipeline.offer / totalApplications) * 100,
          100
        )}%`
      : "0%";

  return (
    <div className="p-5 sm:p-8">
      {/* Welcome */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Good morning, Recruiter 👋
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening with your recruitment pipeline.
          </p>
        </div>

        <Link
          to="/jobs"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Create Job
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading recruitment data...
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open Jobs"
          value={String(stats.openJobs)}
          change="Live"
          icon={<BriefcaseBusiness size={20} />}
        />

        <StatCard
          title="Candidates"
          value={String(stats.candidates)}
          change="Live"
          icon={<Users size={20} />}
        />

        <StatCard
          title="Interviews"
          value={String(stats.interviews)}
          change="Live"
          icon={<CalendarDays size={20} />}
        />

        <StatCard
          title="Offers"
          value={String(stats.offers)}
          change="Live"
          icon={<BarChart3 size={20} />}
        />
      </div>

      {/* Main Grid */}
      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        {/* Pipeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
          <h3 className="font-semibold">
            Application Pipeline
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Current candidate progression
          </p>

          <div className="mt-8 space-y-6">
            <Pipeline
              name="Applied"
              value={stats.pipeline.applied}
              width={appliedWidth}
            />

            <Pipeline
              name="Screening"
              value={stats.pipeline.screening}
              width={screeningWidth}
            />

            <Pipeline
              name="Interview"
              value={stats.pipeline.interview}
              width={interviewWidth}
            />

            <Pipeline
              name="Offer"
              value={stats.pipeline.offer}
              width={offerWidth}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-slate-900 p-6 text-white xl:col-span-2">
          <h3 className="font-semibold">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Manage your recruitment workflow.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              to="/jobs"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-700 p-3 text-left text-sm hover:bg-slate-800"
            >
              <Plus size={17} />
              Create a new job
            </Link>

            <Link
              to="/candidates"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-700 p-3 text-left text-sm hover:bg-slate-800"
            >
              <Users size={17} />
              Add candidate
            </Link>

            <Link
              to="/interviews"
              className="flex w-full items-center gap-3 rounded-xl border border-slate-700 p-3 text-left text-sm hover:bg-slate-800"
            >
              <CalendarDays size={17} />
              Schedule interview
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <RecentApplications />
    </div>
  );
}

/* =========================================================
   RECENT APPLICATIONS
========================================================= */

function RecentApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/applications")
      .then((res) => {
        setApplications(res.data);
      })
      .catch((error) => {
        console.error(
          "Failed to load recent applications:",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredApplications = applications
    .filter((application) => {
      const candidateName =
        application.candidate?.name || "";

      const jobTitle =
        application.job?.title || "";

      const searchText = search.toLowerCase();

      return (
        candidateName.toLowerCase().includes(searchText) ||
        jobTitle.toLowerCase().includes(searchText)
      );
    })
    .slice(0, 5);

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-semibold">
            Recent Applications
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Latest candidate activity
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
          <Search
            size={16}
            className="text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search candidates..."
            className="w-48 text-sm outline-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-6 py-4">
                Candidate
              </th>

              <th className="px-6 py-4">
                Position
              </th>

              <th className="px-6 py-4">
                Applied
              </th>

              <th className="px-6 py-4">
                Stage
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  Loading applications...
                </td>
              </tr>
            ) : filteredApplications.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-8 text-center text-sm text-slate-500"
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              filteredApplications.map(
                (application) => {
                  const candidate =
                    application.candidate;

                  const job = application.job;

                  const name =
                    candidate?.name ||
                    "Unknown Candidate";

                  const position =
                    job?.title ||
                    "Unknown Position";

                  const initials = name
                    .split(" ")
                    .map(
                      (part: string) =>
                        part[0]
                    )
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();

                  const appliedDate =
                    application.appliedAt
                      ? new Date(
                          application.appliedAt
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )
                      : "—";

                  return (
                    <Application
                      key={application.id}
                      initials={initials}
                      name={name}
                      position={position}
                      date={appliedDate}
                      status={
                        application.stage ||
                        "Applied"
                      }
                    />
                  );
                }
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  title,
  value,
  change,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          {icon}
        </div>

        <span className="text-xs font-semibold text-emerald-600">
          {change}
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   PIPELINE
========================================================= */

function Pipeline({
  name,
  value,
  width,
}: {
  name: string;
  value: number;
  width: string;
}) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-medium">
          {name}
        </span>

        <span className="text-slate-500">
          {value}
        </span>
      </div>

      <div className="h-2 rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-slate-900"
          style={{ width }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   APPLICATION ROW
========================================================= */

function Application({
  initials,
  name,
  position,
  date,
  status,
}: {
  initials: string;
  name: string;
  position: string;
  date: string;
  status: string;
}) {
  return (
    <tr className="border-t border-slate-100 hover:bg-slate-50">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
            {initials}
          </div>

          <span className="font-medium">
            {name}
          </span>
        </div>
      </td>

      <td className="px-6 py-4 text-slate-600">
        {position}
      </td>

      <td className="px-6 py-4 text-slate-500">
        {date}
      </td>

      <td className="px-6 py-4">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">
          {status}
        </span>
      </td>
    </tr>
  );
}

/* =========================================================
   LAYOUT
========================================================= */

function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("hireflow_user") || "{}"
  );

  const logout = () => {
    localStorage.removeItem("hireflow_token");
    localStorage.removeItem("hireflow_user");
    navigate("/login");
  };

  const getPageTitle = () => {
    if (location.pathname === "/") return "Dashboard";
    if (location.pathname.includes("/jobs")) return "Jobs";
    if (location.pathname.includes("/candidates")) return "Candidates";
    if (location.pathname.includes("/applications")) return "Applications";
    if (location.pathname.includes("/interviews")) return "Interviews";
    if (location.pathname.includes("/settings")) return "Settings";

    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-20 items-center border-b border-slate-200 px-6">
          <div>
            <div className="text-xl font-bold text-slate-900">
              HireFlow
            </div>
            <div className="text-xs text-slate-500">
              Recruitment OS
            </div>
          </div>
        </div>

        <nav className="space-y-1 p-4">
          <Link
            to="/"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              location.pathname === "/"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/jobs"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              location.pathname === "/jobs"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Jobs
          </Link>

          <Link
            to="/candidates"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              location.pathname === "/candidates"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Candidates
          </Link>

          <Link
            to="/applications"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              location.pathname === "/applications"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Applications
          </Link>

          <Link
            to="/interviews"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              location.pathname === "/interviews"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Interviews
          </Link>

          <Link
            to="/settings"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${
              location.pathname === "/settings"
                ? "bg-slate-900 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Settings
          </Link>
        </nav>
      </aside>

      {/* MAIN */}
      <div className="ml-64">
        {/* HEADER */}
        <header className="sticky top-0 z-30 flex h-24 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div>
            <div className="text-sm text-slate-500">
              Recruitment workspace
            </div>

            <h1 className="text-2xl font-semibold text-slate-900">
              {getPageTitle()}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* NOTIFICATION */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationOpen(!notificationOpen);
                  setProfileOpen(false);
                }}
                className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                aria-label="Notifications"
              >
                <span className="text-xl">🔔</span>

                {/* Notification dot */}
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-14 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="font-semibold text-slate-900">
                      Notifications
                    </div>
                    <div className="text-xs text-slate-500">
                      Your latest recruitment updates
                    </div>
                  </div>

                  <div className="divide-y divide-slate-100">
                    <div className="px-5 py-4 hover:bg-slate-50">
                      <div className="text-sm font-medium text-slate-900">
                        New applications received
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        New candidates have applied to your open jobs.
                      </div>
                    </div>

                    <div className="px-5 py-4 hover:bg-slate-50">
                      <div className="text-sm font-medium text-slate-900">
                        Interviews scheduled
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Check the Interviews section for upcoming meetings.
                      </div>
                    </div>

                    <div className="px-5 py-4 hover:bg-slate-50">
                      <div className="text-sm font-medium text-slate-900">
                        HireFlow is up to date
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        No critical alerts at the moment.
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setNotificationOpen(false)}
                    className="w-full border-t border-slate-100 px-5 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Mark as viewed
                  </button>
                </div>
              )}
            </div>

            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!profileOpen);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition hover:bg-slate-50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((word: string) => word[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()
                    : "HA"}
                </div>

                <div className="text-left">
                  <div className="text-sm font-semibold text-slate-900">
                    {user?.name || "HireFlow Admin"}
                  </div>

                  <div className="text-xs text-slate-500">
                    {user?.role || "Admin"}
                  </div>
                </div>

                <span
                  className={`text-slate-500 transition-transform ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-16 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  <div className="border-b border-slate-100 px-5 py-4">
                    <div className="font-semibold text-slate-900">
                      {user?.name || "HireFlow Admin"}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {user?.email || "admin@hireflow.com"}
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      👤 Profile & Settings
                    </button>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        navigate("/settings");
                      }}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      ⚙️ Account Settings
                    </button>

                    <button
                      onClick={logout}
                      className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* LOGOUT BUTTON */}
            <button
              onClick={logout}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const token =
    localStorage.getItem("hireflow_token");

  if (!token) {
    return <LoginRedirect />;
  }

  return <>{children}</>;
}

function LoginRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  return null;
}

/* =========================================================
   APP ROUTER
========================================================= */

function App() {
  return (
    <HashRouter>
      <Routes>
        {/* PUBLIC */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* PROTECTED DASHBOARD */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PROTECTED JOBS */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Layout>
                <Jobs />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PROTECTED CANDIDATES */}
        <Route
          path="/candidates"
          element={
            <ProtectedRoute>
              <Layout>
                <Candidates />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PROTECTED APPLICATIONS */}
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <Layout>
                <Applications />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PROTECTED INTERVIEWS */}
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <Layout>
                <Interviews />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* PROTECTED SETTINGS */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Layout>
                <Settings />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;