import { useEffect, useMemo, useState } from "react";

import {
  BarChart3,
  CalendarDays,
  Plus,
  RefreshCw,
  TrendingUp,
  Users,
  BriefcaseBusiness,
  UserPlus,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Link } from "react-router-dom";

import api from "../services/api";

/* =========================================================
   TYPES
========================================================= */

interface Pipeline {
  applied: number;
  screening: number;
  interview: number;
  offer: number;
}

interface DashboardStats {
  openJobs: number;
  candidates: number;
  applications: number;
  interviews: number;
  offers: number;
  pipeline: Pipeline;
}

interface Application {
  id: number;
  candidateId: number;
  jobId: number;
  stage: string;
  status: string;
  appliedAt: string;

  candidate?: {
    id: number;
    name: string;
    email?: string;
  };

  job?: {
    id: number;
    title: string;
  };
}

/* =========================================================
   DASHBOARD
========================================================= */

export default function DashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats>({
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

  const [applications, setApplications] =
    useState<Application[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [search, setSearch] =
    useState("");

  /* =======================================================
     LOAD DASHBOARD
  ======================================================= */

  async function loadDashboard(
    showRefresh = false
  ) {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        dashboardResponse,
        applicationsResponse,
      ] = await Promise.all([
        api.get("/dashboard"),
        api.get("/applications"),
      ]);

      setStats(dashboardResponse.data);

      setApplications(
        applicationsResponse.data
      );
    } catch (error) {
      console.error(
        "Failed to load dashboard:",
        error
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  /* =======================================================
     FILTER RECENT APPLICATIONS
  ======================================================= */

  const recentApplications =
    useMemo(() => {
      const query =
        search.toLowerCase().trim();

      return applications
        .filter((application) => {
          if (!query) return true;

          const candidateName =
            application.candidate?.name ||
            "";

          const jobTitle =
            application.job?.title ||
            "";

          return (
            candidateName
              .toLowerCase()
              .includes(query) ||
            jobTitle
              .toLowerCase()
              .includes(query)
          );
        })
        .sort(
          (a, b) =>
            new Date(
              b.appliedAt
            ).getTime() -
            new Date(
              a.appliedAt
            ).getTime()
        )
        .slice(0, 6);
    }, [applications, search]);

  /* =======================================================
     CHART DATA
  ======================================================= */

  const pipelineData = [
    {
      name: "Applied",
      value: stats.pipeline.applied,
    },
    {
      name: "Screening",
      value: stats.pipeline.screening,
    },
    {
      name: "Interview",
      value: stats.pipeline.interview,
    },
    {
      name: "Offer",
      value: stats.pipeline.offer,
    },
  ];

  const totalPipeline =
    pipelineData.reduce(
      (total, item) =>
        total + item.value,
      0
    );

  /* =======================================================
     CONVERSION
  ======================================================= */

  const interviewRate =
    stats.applications > 0
      ? (
          (stats.pipeline.interview /
            stats.applications) *
          100
        ).toFixed(1)
      : "0";

  const offerRate =
    stats.applications > 0
      ? (
          (stats.pipeline.offer /
            stats.applications) *
          100
        ).toFixed(1)
      : "0";

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="p-5 sm:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-10 w-72 rounded-xl bg-slate-200" />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[1, 2, 3, 4].map(
              (item) => (
                <div
                  key={item}
                  className="h-32 rounded-2xl bg-slate-200"
                />
              )
            )}
          </div>

          <div className="grid gap-6 xl:grid-cols-5">
            <div className="h-80 rounded-2xl bg-slate-200 xl:col-span-3" />

            <div className="h-80 rounded-2xl bg-slate-200 xl:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="p-5 sm:p-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Recruitment overview
          </p>

          <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
            Good morning, Recruiter 👋
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Here's what's happening across your hiring pipeline.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() =>
              loadDashboard(true)
            }
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

          <Link
            to="/jobs"
            className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
          >
            <Plus size={17} />

            Create Job
          </Link>
        </div>
      </div>

      {/* KPI CARDS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Open Jobs"
          value={stats.openJobs}
          subtitle="Currently active"
          icon={
            <BriefcaseBusiness
              size={20}
            />
          }
        />

        <StatCard
          title="Candidates"
          value={stats.candidates}
          subtitle="Total talent pool"
          icon={
            <Users size={20} />
          }
        />

        <StatCard
          title="Interviews"
          value={stats.interviews}
          subtitle="Scheduled interviews"
          icon={
            <CalendarDays
              size={20}
            />
          }
        />

        <StatCard
          title="Offers"
          value={stats.offers}
          subtitle="Offers generated"
          icon={
            <TrendingUp
              size={20}
            />
          }
        />
      </div>

      {/* CHARTS */}

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        {/* PIPELINE BAR CHART */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Recruitment Pipeline
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Candidate progression through hiring stages
              </p>
            </div>

            <div className="rounded-xl bg-slate-100 p-2">
              <BarChart3
                size={18}
                className="text-slate-600"
              />
            </div>
          </div>

          <div className="mt-6 h-64">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={pipelineData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                />

                <Tooltip />

                <Bar
                  dataKey="value"
                  name="Candidates"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PIPELINE DISTRIBUTION */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 xl:col-span-2">
          <div>
            <h3 className="font-semibold text-slate-900">
              Pipeline Distribution
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Current applications by stage
            </p>
          </div>

          <div className="relative mt-4 h-56">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <PieChart>
                <Pie
                  data={pipelineData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {pipelineData.map(
                    (_, index) => (
                      <Cell
                        key={`cell-${index}`}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-slate-900">
                  {totalPipeline}
                </p>

                <p className="text-xs text-slate-500">
                  Applications
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {pipelineData.map(
              (item) => (
                <div
                  key={item.name}
                  className="rounded-xl bg-slate-50 p-3"
                >
                  <p className="text-xs text-slate-500">
                    {item.name}
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">
                    {item.value}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* CONVERSION METRICS */}

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Applications"
          value={stats.applications}
          description="Total applications received"
        />

        <MetricCard
          title="Interview Rate"
          value={`${interviewRate}%`}
          description="Applications reaching interview"
        />

        <MetricCard
          title="Offer Rate"
          value={`${offerRate}%`}
          description="Applications reaching offer"
        />
      </div>

      {/* QUICK ACTIONS */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
        <div>
          <h3 className="font-semibold text-slate-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Jump directly into your recruitment workflow.
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <QuickAction
            to="/jobs"
            icon={
              <BriefcaseBusiness
                size={19}
              />
            }
            title="Create Job"
            description="Publish a new opening"
          />

          <QuickAction
            to="/candidates"
            icon={
              <UserPlus size={19} />
            }
            title="Add Candidate"
            description="Add someone to your talent pool"
          />

          <QuickAction
            to="/interviews"
            icon={
              <CalendarDays
                size={19}
              />
            }
            title="Schedule Interview"
            description="Plan your next interview"
          />
        </div>
      </div>

      {/* RECENT APPLICATIONS */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center">
          <div>
            <h3 className="font-semibold text-slate-900">
              Recent Applications
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Latest candidate activity
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Users
              size={16}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search..."
              className="w-40 text-sm outline-none"
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
              {recentApplications.length ===
              0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-10 text-center text-sm text-slate-500"
                  >
                    No applications found.
                  </td>
                </tr>
              ) : (
                recentApplications.map(
                  (application) => {
                    const candidateName =
                      application
                        .candidate?.name ||
                      "Unknown Candidate";

                    const jobTitle =
                      application.job
                        ?.title ||
                      "Unknown Position";

                    const initials =
                      candidateName
                        .split(" ")
                        .map(
                          (part) =>
                            part[0]
                        )
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                    return (
                      <tr
                        key={
                          application.id
                        }
                        className="border-t border-slate-100 hover:bg-slate-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                              {initials}
                            </div>

                            <div>
                              <p className="font-medium text-slate-900">
                                {
                                  candidateName
                                }
                              </p>

                              <p className="text-xs text-slate-500">
                                {
                                  application
                                    .candidate
                                    ?.email
                                }
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600">
                          {jobTitle}
                        </td>

                        <td className="px-6 py-4 text-slate-500">
                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                            {
                              application.stage
                            }
                          </span>
                        </td>
                      </tr>
                    );
                  }
                )
              )}
            </tbody>
          </table>
        </div>
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
  subtitle,
  icon,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          Live
        </span>
      </div>

      <p className="mt-5 text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {subtitle}
      </p>
    </div>
  );
}

/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  title,
  value,
  description,
}: {
  title: string;
  value: number | string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   QUICK ACTION
========================================================= */

function QuickAction({
  to,
  icon,
  title,
  description,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
        {icon}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </Link>
  );
}