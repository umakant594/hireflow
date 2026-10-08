import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Video,
} from "lucide-react";
import api from "../services/api";

type Interview = {
  id: number;
  candidateId: number;
  jobId: number;
  interviewer: string;
  type: string;
  mode: string;
  scheduledAt: string;
  status: string;
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

type FormData = {
  candidateId: string;
  jobId: string;
  interviewer: string;
  type: string;
  mode: string;
  scheduledAt: string;
};

export function Interviews() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormData>({
    candidateId: "",
    jobId: "",
    interviewer: "Mrunal Rao",
    type: "Technical",
    mode: "Video",
    scheduledAt: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [
        interviewsRes,
        candidatesRes,
        jobsRes,
      ] = await Promise.all([
        api.get("/interviews"),
        api.get("/candidates"),
        api.get("/jobs"),
      ]);

      setInterviews(interviewsRes.data);
      setCandidates(candidatesRes.data);
      setJobs(jobsRes.data);
    } catch (error) {
      console.error("Failed to load interviews:", error);
    } finally {
      setLoading(false);
    }
  }

  const candidateMap = useMemo(() => {
    return Object.fromEntries(
      candidates.map((candidate) => [
        candidate.id,
        candidate,
      ])
    );
  }, [candidates]);

  const jobMap = useMemo(() => {
    return Object.fromEntries(
      jobs.map((job) => [job.id, job])
    );
  }, [jobs]);

  const filteredInterviews = interviews.filter(
    (interview) => {
      const candidate =
        candidateMap[interview.candidateId];

      const job = jobMap[interview.jobId];

      const searchText = `
        ${candidate?.name || ""}
        ${candidate?.email || ""}
        ${job?.title || ""}
        ${interview.interviewer}
      `.toLowerCase();

      const matchesSearch = searchText.includes(
        search.toLowerCase()
      );

      const matchesType =
        typeFilter === "All Types" ||
        interview.type === typeFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        interview.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    }
  );

  const upcomingCount = interviews.filter(
    (interview) =>
      interview.status === "Scheduled" &&
      new Date(interview.scheduledAt) >= new Date()
  ).length;

  const completedCount = interviews.filter(
    (interview) =>
      interview.status === "Completed"
  ).length;

  const thisWeekCount = interviews.filter(
    (interview) => {
      const date = new Date(interview.scheduledAt);
      const now = new Date();

      const weekLater = new Date(now);
      weekLater.setDate(
        now.getDate() + 7
      );

      return date >= now && date <= weekLater;
    }
  ).length;

  function updateForm(
    field: keyof FormData,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function scheduleInterview(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (
      !form.candidateId ||
      !form.jobId ||
      !form.interviewer ||
      !form.scheduledAt
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(
        "/interviews",
        {
          candidateId: Number(
            form.candidateId
          ),
          jobId: Number(form.jobId),
          interviewer: form.interviewer,
          type: form.type,
          mode: form.mode,
          scheduledAt: new Date(
            form.scheduledAt
          ).toISOString(),
          status: "Scheduled",
        }
      );

      setInterviews((current) => [
        ...current,
        response.data,
      ]);

      setShowModal(false);

      setForm({
        candidateId: "",
        jobId: "",
        interviewer: "Mrunal Rao",
        type: "Technical",
        mode: "Video",
        scheduledAt: "",
      });
    } catch (error) {
      console.error(
        "Failed to schedule interview:",
        error
      );

      alert(
        "Failed to schedule interview."
      );
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      await api.put(`/interviews/${id}`, {
        status,
      });

      setInterviews((current) =>
        current.map((interview) =>
          interview.id === id
            ? {
                ...interview,
                status,
              }
            : interview
        )
      );
    } catch (error) {
      console.error(
        "Failed to update interview:",
        error
      );

      alert(
        "Failed to update interview."
      );
    }
  }

  async function deleteInterview(
    id: number
  ) {
    const confirmed = window.confirm(
      "Delete this interview?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/interviews/${id}`);

      setInterviews((current) =>
        current.filter(
          (interview) =>
            interview.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete interview:",
        error
      );

      alert(
        "Failed to delete interview."
      );
    }
  }

  return (
    <div className="p-5 sm:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">
            Interviews
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Schedule and manage candidate interviews.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Schedule Interview
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          title="Total Interviews"
          value={String(interviews.length)}
        />

        <Stat
          title="Upcoming"
          value={String(upcomingCount)}
        />

        <Stat
          title="Completed"
          value={String(completedCount)}
        />

        <Stat
          title="This Week"
          value={String(thisWeekCount)}
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
            placeholder="Search candidates, jobs or interviewers..."
            className="w-full bg-transparent text-sm outline-none"
          />

        </div>

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>All Types</option>
          <option>Technical</option>
          <option>HR</option>
          <option>Managerial</option>
        </select>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>All Status</option>
          <option>Scheduled</option>
          <option>Completed</option>
          <option>Cancelled</option>
        </select>

      </div>

      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading interviews from database...
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">

              <tr>
                <th className="px-6 py-4">
                  Candidate
                </th>

                <th className="px-6 py-4">
                  Position
                </th>

                <th className="px-6 py-4">
                  Date & Time
                </th>

                <th className="px-6 py-4">
                  Interviewer
                </th>

                <th className="px-6 py-4">
                  Type
                </th>

                <th className="px-6 py-4">
                  Mode
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4" />
              </tr>

            </thead>

            <tbody>

              {filteredInterviews.map(
                (interview) => {
                  const candidate =
                    candidateMap[
                      interview.candidateId
                    ];

                  const job =
                    jobMap[
                      interview.jobId
                    ];

                  const initials =
                    candidate?.name
                      ?.split(" ")
                      .map(
                        (part) => part[0]
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase() || "?";

                  return (
                    <tr
                      key={interview.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      {/* Candidate */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                            {initials}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {candidate?.name ||
                                `Candidate #${interview.candidateId}`}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {candidate?.email ||
                                "—"}
                            </p>
                          </div>

                        </div>

                      </td>

                      {/* Position */}
                      <td className="px-6 py-5 font-medium">
                        {job?.title ||
                          `Job #${interview.jobId}`}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={15}
                            className="text-slate-400"
                          />

                          <div>

                            <p className="font-medium">
                              {new Date(
                                interview.scheduledAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                              <Clock size={12} />

                              {new Date(
                                interview.scheduledAt
                              ).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Interviewer */}
                      <td className="px-6 py-5">
                        {interview.interviewer}
                      </td>

                      {/* Type */}
                      <td className="px-6 py-5">
                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium">
                          {interview.type}
                        </span>
                      </td>

                      {/* Mode */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-slate-600">

                          {interview.mode ===
                          "Video" ? (
                            <Video size={15} />
                          ) : (
                            <MapPin size={15} />
                          )}

                          {interview.mode}

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <select
                          value={interview.status}
                          onChange={(event) =>
                            updateStatus(
                              interview.id,
                              event.target.value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${
                            interview.status ===
                            "Scheduled"
                              ? "bg-blue-50 text-blue-700"
                              : interview.status ===
                                "Completed"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          <option>
                            Scheduled
                          </option>

                          <option>
                            Completed
                          </option>

                          <option>
                            Cancelled
                          </option>
                        </select>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">

                        <button
                          onClick={() =>
                            deleteInterview(
                              interview.id
                            )
                          }
                          title="Delete interview"
                          className="rounded-lg p-2 hover:bg-red-50 hover:text-red-600"
                        >
                          <MoreHorizontal
                            size={18}
                          />
                        </button>

                      </td>

                    </tr>
                  );
                }
              )}

              {!loading &&
                filteredInterviews.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No interviews found.
                    </td>
                  </tr>
                )}

            </tbody>

          </table>

        </div>

        <div className="border-t border-slate-100 px-6 py-4">

          <p className="text-xs text-slate-500">
            Showing{" "}
            {filteredInterviews.length} of{" "}
            {interviews.length} interviews
          </p>

        </div>

      </div>

      {/* Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            <div className="border-b border-slate-200 p-6">

              <h3 className="text-lg font-bold">
                Schedule Interview
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create a new candidate interview.
              </p>

            </div>

            <form
              onSubmit={scheduleInterview}
              className="space-y-5 p-6"
            >

              {/* Candidate */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Candidate *
                </label>

                <select
                  value={form.candidateId}
                  onChange={(event) =>
                    updateForm(
                      "candidateId",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  required
                >
                  <option value="">
                    Select candidate
                  </option>

                  {candidates.map(
                    (candidate) => (
                      <option
                        key={candidate.id}
                        value={candidate.id}
                      >
                        {candidate.name}
                      </option>
                    )
                  )}
                </select>
              </div>

              {/* Job */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Position *
                </label>

                <select
                  value={form.jobId}
                  onChange={(event) =>
                    updateForm(
                      "jobId",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  required
                >
                  <option value="">
                    Select position
                  </option>

                  {jobs.map((job) => (
                    <option
                      key={job.id}
                      value={job.id}
                    >
                      {job.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Interviewer */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Interviewer *
                </label>

                <input
                  value={form.interviewer}
                  onChange={(event) =>
                    updateForm(
                      "interviewer",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  placeholder="Interviewer name"
                  required
                />
              </div>

              {/* Type + Mode */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Interview Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(event) =>
                      updateForm(
                        "type",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  >
                    <option>
                      Technical
                    </option>

                    <option>
                      HR
                    </option>

                    <option>
                      Managerial
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Mode
                  </label>

                  <select
                    value={form.mode}
                    onChange={(event) =>
                      updateForm(
                        "mode",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  >
                    <option>
                      Video
                    </option>

                    <option>
                      In-person
                    </option>
                  </select>
                </div>

              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Date & Time *
                </label>

                <input
                  type="datetime-local"
                  value={
                    form.scheduledAt
                  }
                  onChange={(event) =>
                    updateForm(
                      "scheduledAt",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Scheduling..."
                    : "Schedule Interview"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

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