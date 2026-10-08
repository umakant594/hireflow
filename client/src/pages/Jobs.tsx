import { useEffect, useMemo, useState } from "react";
import {
  BriefcaseBusiness,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  X,
  Trash2,
} from "lucide-react";
import api from "../services/api";

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  employment: string;
  salary: string;
  description: string;
  status: string;
};

type JobForm = {
  title: string;
  department: string;
  location: string;
  employment: string;
  salary: string;
  description: string;
};

const emptyForm: JobForm = {
  title: "",
  department: "Engineering",
  location: "Bengaluru",
  employment: "Full-time",
  salary: "",
  description: "",
};

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [department, setDepartment] =
    useState("All departments");
  const [status, setStatus] =
    useState("All statuses");

  const [form, setForm] =
    useState<JobForm>(emptyForm);

  useEffect(() => {
    loadJobs();
  }, []);

  async function loadJobs() {
    try {
      const response = await api.get("/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error("Failed to load jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof JobForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createJob(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (
      !form.title ||
      !form.department ||
      !form.location ||
      !form.employment ||
      !form.salary
    ) {
      alert("Please fill all required fields.");
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(
        "/jobs",
        form
      );

      setJobs((current) => [
        response.data,
        ...current,
      ]);

      setShowModal(false);
      setForm(emptyForm);
    } catch (error) {
      console.error(
        "Failed to create job:",
        error
      );

      alert("Failed to create job.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteJob(id: number) {
    const confirmed = window.confirm(
      "Delete this job?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/jobs/${id}`);

      setJobs((current) =>
        current.filter(
          (job) => job.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete job:",
        error
      );

      alert("Failed to delete job.");
    }
  }

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const text = `
        ${job.title}
        ${job.department}
        ${job.location}
        ${job.employment}
      `.toLowerCase();

      const matchesSearch =
        text.includes(search.toLowerCase());

      const matchesDepartment =
        department === "All departments" ||
        job.department === department;

      const matchesStatus =
        status === "All statuses" ||
        job.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    jobs,
    search,
    department,
    status,
  ]);

  const activeJobs = jobs.filter(
    (job) => job.status === "Active"
  ).length;

  return (
    <div className="p-5 sm:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-2xl font-bold">
            Jobs
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Create and manage your organization's open positions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Create Job
        </button>

      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">

        <Summary
          icon={
            <BriefcaseBusiness size={19} />
          }
          label="Total Jobs"
          value={String(jobs.length)}
        />

        <Summary
          icon={
            <BriefcaseBusiness size={19} />
          }
          label="Active Jobs"
          value={String(activeJobs)}
        />

        <Summary
          icon={<Users size={19} />}
          label="Total Applicants"
          value="20"
        />

      </div>

      {/* Search + Filters */}
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
            placeholder="Search jobs..."
            className="w-full bg-transparent text-sm outline-none"
          />

        </div>

        <select
          value={department}
          onChange={(event) =>
            setDepartment(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>
            All departments
          </option>
          <option>Engineering</option>
          <option>Analytics</option>
          <option>Design</option>
          <option>Human Resources</option>
        </select>

        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>All statuses</option>
          <option>Active</option>
          <option>Closed</option>
        </select>

      </div>

      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading jobs from database...
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">

              <tr>
                <th className="px-6 py-4">
                  Position
                </th>

                <th className="px-6 py-4">
                  Department
                </th>

                <th className="px-6 py-4">
                  Location
                </th>

                <th className="px-6 py-4">
                  Salary
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Actions
                </th>
              </tr>

            </thead>

            <tbody>

              {filteredJobs.map((job) => (

                <tr
                  key={job.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >

                  <td className="px-6 py-5">

                    <p className="font-semibold">
                      {job.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {job.employment}
                    </p>

                  </td>

                  <td className="px-6 py-5 text-slate-600">
                    {job.department}
                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-2 text-slate-600">

                      <MapPin size={15} />

                      {job.location}

                    </div>

                  </td>

                  <td className="px-6 py-5 font-medium">
                    {job.salary}
                  </td>

                  <td className="px-6 py-5">

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        job.status ===
                        "Active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {job.status}
                    </span>

                  </td>

                  <td className="px-6 py-5">

                    <div className="flex items-center gap-1">

                      <button
                        title="Delete job"
                        onClick={() =>
                          deleteJob(job.id)
                        }
                        className="rounded-lg p-2 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={17} />
                      </button>

                      <button
                        className="rounded-lg p-2 hover:bg-slate-100"
                        title="More"
                      >
                        <MoreHorizontal
                          size={18}
                        />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

              {!loading &&
                filteredJobs.length ===
                  0 && (

                  <tr>

                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No jobs found.
                    </td>

                  </tr>

                )}

            </tbody>

          </table>

        </div>

        <div className="border-t border-slate-100 px-6 py-4">

          <p className="text-xs text-slate-500">
            Showing{" "}
            {filteredJobs.length} of{" "}
            {jobs.length} jobs
          </p>

        </div>

      </div>

      {/* Create Job Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">

              <div>
                <h3 className="text-lg font-bold">
                  Create New Job
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new position to your recruitment pipeline.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowModal(false)
                }
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={18} />
              </button>

            </div>

            {/* Form */}
            <form
              onSubmit={createJob}
              className="space-y-5 p-6"
            >

              {/* Title */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Job Title *
                </label>

                <input
                  value={form.title}
                  onChange={(event) =>
                    updateForm(
                      "title",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Frontend Developer"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  required
                />

              </div>

              {/* Department */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Department *
                </label>

                <select
                  value={form.department}
                  onChange={(event) =>
                    updateForm(
                      "department",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  <option>
                    Engineering
                  </option>

                  <option>
                    Analytics
                  </option>

                  <option>
                    Design
                  </option>

                  <option>
                    Human Resources
                  </option>
                </select>

              </div>

              {/* Location */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Location *
                </label>

                <input
                  value={form.location}
                  onChange={(event) =>
                    updateForm(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="Bengaluru / Remote"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  required
                />

              </div>

              {/* Employment */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Employment
                  </label>

                  <select
                    value={
                      form.employment
                    }
                    onChange={(event) =>
                      updateForm(
                        "employment",
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  >
                    <option>
                      Full-time
                    </option>

                    <option>
                      Part-time
                    </option>

                    <option>
                      Contract
                    </option>

                    <option>
                      Internship
                    </option>
                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Salary *
                  </label>

                  <input
                    value={form.salary}
                    onChange={(event) =>
                      updateForm(
                        "salary",
                        event.target.value
                      )
                    }
                    placeholder="₹6–10 LPA"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                    required
                  />

                </div>

              </div>

              {/* Description */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Description
                </label>

                <textarea
                  value={
                    form.description
                  }
                  onChange={(event) =>
                    updateForm(
                      "description",
                      event.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe the role..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />

              </div>

              {/* Actions */}
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
                  className="rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
                >
                  {saving
                    ? "Creating..."
                    : "Create Job"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

function Summary({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
        {icon}
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold">
        {value}
      </p>

    </div>
  );
}

export default Jobs;