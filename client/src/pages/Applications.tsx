import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  MoreHorizontal,
  Search,
  UserRound,
} from "lucide-react";
import api from "../services/api";

type Application = {
  id: number;
  candidateId: number;
  jobId: number;
  stage: string;
  status: string;
  appliedAt: string;
};

type Candidate = {
  id: number;
  name: string;
  email: string;
};

type Job = {
  id: number;
  title: string;
};

const stages = ["Applied", "Screening", "Interview", "Offer"];

export function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/applications"),
      api.get("/candidates"),
      api.get("/jobs"),
    ])
      .then(([applicationsRes, candidatesRes, jobsRes]) => {
        setApplications(applicationsRes.data);
        setCandidates(candidatesRes.data);
        setJobs(jobsRes.data);
      })
      .catch((error) => {
        console.error("Failed to load applications:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const candidateMap = useMemo(() => {
    return Object.fromEntries(
      candidates.map((candidate) => [candidate.id, candidate])
    );
  }, [candidates]);

  const jobMap = useMemo(() => {
    return Object.fromEntries(
      jobs.map((job) => [job.id, job])
    );
  }, [jobs]);

  const filteredApplications = applications.filter((application) => {
    const candidate = candidateMap[application.candidateId];
    const job = jobMap[application.jobId];

    const searchText = `${candidate?.name || ""} ${
      candidate?.email || ""
    } ${job?.title || ""}`.toLowerCase();

    const matchesSearch = searchText.includes(
      search.toLowerCase()
    );

    const matchesStage =
      stageFilter === "All Stages" ||
      application.stage === stageFilter;

    const matchesStatus =
      statusFilter === "All Status" ||
      application.status === statusFilter;

    return matchesSearch && matchesStage && matchesStatus;
  });

  const screeningCount = applications.filter(
    (application) => application.stage === "Screening"
  ).length;

  const interviewCount = applications.filter(
    (application) => application.stage === "Interview"
  ).length;

  const offerCount = applications.filter(
    (application) => application.stage === "Offer"
  ).length;

  async function updateStage(
    id: number,
    stage: string
  ) {
    try {
      await api.put(`/applications/${id}`, {
        stage,
      });

      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? { ...application, stage }
            : application
        )
      );
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Failed to update application stage.");
    }
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      await api.put(`/applications/${id}`, {
        status,
      });

      setApplications((current) =>
        current.map((application) =>
          application.id === id
            ? { ...application, status }
            : application
        )
      );
    } catch (error) {
      console.error("Failed to update application:", error);
      alert("Failed to update application status.");
    }
  }

  return (
    <div className="p-5 sm:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Applications
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Track candidates through your recruitment pipeline.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          title="Total Applications"
          value={String(applications.length)}
        />

        <Stat
          title="Screening"
          value={String(screeningCount)}
        />

        <Stat
          title="Interviews"
          value={String(interviewCount)}
        />

        <Stat
          title="Offers"
          value={String(offerCount)}
        />
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5">
          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search candidates or positions..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        <select
          value={stageFilter}
          onChange={(event) =>
            setStageFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>All Stages</option>

          {stages.map((stage) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Closed</option>
        </select>
      </div>

      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading applications from database...
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
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

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4" />
              </tr>
            </thead>

            <tbody>
              {filteredApplications.map(
                (application) => {
                  const candidate =
                    candidateMap[
                      application.candidateId
                    ];

                  const job =
                    jobMap[application.jobId];

                  const initials =
                    candidate?.name
                      ?.split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?";

                  return (
                    <tr
                      key={application.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                            {initials}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {candidate?.name ||
                                `Candidate #${application.candidateId}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {candidate?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium">
                          {job?.title ||
                            `Job #${application.jobId}`}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <CalendarDays size={15} />

                          {new Date(
                            application.appliedAt
                          ).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={application.stage}
                          onChange={(event) =>
                            updateStage(
                              application.id,
                              event.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${
                            application.stage ===
                            "Offer"
                              ? "bg-emerald-50 text-emerald-700"
                              : application.stage ===
                                "Interview"
                              ? "bg-blue-50 text-blue-700"
                              : application.stage ===
                                "Screening"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {stages.map((stage) => (
                            <option
                              key={stage}
                              value={stage}
                            >
                              {stage}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-6 py-5">
                        <select
                          value={application.status}
                          onChange={(event) =>
                            updateStatus(
                              application.id,
                              event.target.value
                            )
                          }
                          className="rounded-full border-0 bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none"
                        >
                          <option value="Active">
                            Active
                          </option>

                          <option value="Closed">
                            Closed
                          </option>
                        </select>
                      </td>

                      <td className="px-6 py-5">
                        <button className="rounded-lg p-2 hover:bg-slate-100">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                }
              )}

              {!loading &&
                filteredApplications.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      <UserRound
                        size={28}
                        className="mx-auto mb-3 text-slate-300"
                      />

                      No applications found.
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4">
          <p className="text-xs text-slate-500">
            Showing {filteredApplications.length} of{" "}
            {applications.length} applications
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">
        {title}
      </p>

      <p className="mt-2 text-2xl font-bold">
        {value}
      </p>
    </div>
  );
}