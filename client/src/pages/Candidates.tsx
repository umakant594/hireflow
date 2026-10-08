import { useEffect, useMemo, useState } from "react";
import {
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Trash2,
} from "lucide-react";
import api from "../services/api";

type Candidate = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  location?: string | null;
  experience?: string | null;
  skills: string;
  status: string;
};

type CandidateForm = {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: string;
  skills: string;
  status: string;
};

const emptyForm: CandidateForm = {
  name: "",
  email: "",
  phone: "",
  location: "Bengaluru",
  experience: "",
  skills: "",
  status: "Applied",
};

const statuses = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
];

function Candidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All Statuses");

  const [form, setForm] =
    useState<CandidateForm>(emptyForm);

  useEffect(() => {
    loadCandidates();
  }, []);

  async function loadCandidates() {
    try {
      const response = await api.get("/candidates");
      setCandidates(response.data);
    } catch (error) {
      console.error(
        "Failed to load candidates:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  function updateForm(
    field: keyof CandidateForm,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function addCandidate(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.skills
    ) {
      alert(
        "Name, email and skills are required."
      );
      return;
    }

    setSaving(true);

    try {
      const response = await api.post(
        "/candidates",
        form
      );

      setCandidates((current) => [
        response.data,
        ...current,
      ]);

      setForm(emptyForm);
      setShowModal(false);
    } catch (error) {
      console.error(
        "Failed to add candidate:",
        error
      );

      alert("Failed to add candidate.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCandidate(id: number) {
    const confirmed = window.confirm(
      "Delete this candidate?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/candidates/${id}`);

      setCandidates((current) =>
        current.filter(
          (candidate) =>
            candidate.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete candidate:",
        error
      );

      alert("Failed to delete candidate.");
    }
  }

  async function updateStatus(
    id: number,
    status: string
  ) {
    try {
      await api.put(`/candidates/${id}`, {
        status,
      });

      setCandidates((current) =>
        current.map((candidate) =>
          candidate.id === id
            ? {
                ...candidate,
                status,
              }
            : candidate
        )
      );
    } catch (error) {
      console.error(
        "Failed to update candidate:",
        error
      );

      alert(
        "Failed to update candidate status."
      );
    }
  }

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchText = `
        ${candidate.name}
        ${candidate.email}
        ${candidate.skills}
        ${candidate.location || ""}
        ${candidate.experience || ""}
      `.toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All Statuses" ||
        candidate.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    candidates,
    search,
    statusFilter,
  ]);

  const interviewCount = candidates.filter(
    (candidate) =>
      candidate.status === "Interview"
  ).length;

  const offerCount = candidates.filter(
    (candidate) =>
      candidate.status === "Offer"
  ).length;

  return (
    <div className="p-5 sm:p-8">

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

        <div>
          <h2 className="text-2xl font-bold">
            Candidates
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track candidates across your recruitment pipeline.
          </p>
        </div>

        <button
          onClick={() =>
            setShowModal(true)
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Add Candidate
        </button>

      </div>

      {/* Stats */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Stat
          title="Total Candidates"
          value={String(
            candidates.length
          )}
        />

        <Stat
          title="New This Week"
          value="32"
        />

        <Stat
          title="In Interview"
          value={String(
            interviewCount
          )}
        />

        <Stat
          title="Offers Sent"
          value={String(
            offerCount
          )}
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
              setSearch(
                event.target.value
              )
            }
            placeholder="Search candidates by name, email or skill..."
            className="w-full bg-transparent text-sm outline-none"
          />

        </div>

        <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-slate-50">
          <SlidersHorizontal
            size={17}
          />
          Filters
        </button>

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(
              event.target.value
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none"
        >
          <option>
            All Statuses
          </option>

          {statuses.map((status) => (
            <option key={status}>
              {status}
            </option>
          ))}
        </select>

      </div>

      {loading && (
        <div className="mb-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
          Loading candidates from database...
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
                  Experience
                </th>

                <th className="px-6 py-4">
                  Location
                </th>

                <th className="px-6 py-4">
                  Skills
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

              {filteredCandidates.map(
                (candidate) => {
                  const initials =
                    candidate.name
                      .split(" ")
                      .map(
                        (word) =>
                          word[0]
                      )
                      .join("")
                      .slice(0, 2)
                      .toUpperCase();

                  const skills =
                    candidate.skills
                      .split(",")
                      .map(
                        (skill) =>
                          skill.trim()
                      )
                      .filter(Boolean);

                  return (
                    <tr
                      key={candidate.id}
                      className="border-t border-slate-100 hover:bg-slate-50"
                    >

                      {/* Candidate */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold">
                            {initials}
                          </div>

                          <div>
                            <p className="font-semibold">
                              {candidate.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {candidate.email}
                            </p>

                            {candidate.phone && (
                              <p className="mt-1 text-xs text-slate-400">
                                {candidate.phone}
                              </p>
                            )}
                          </div>

                        </div>

                      </td>

                      {/* Experience */}
                      <td className="px-6 py-5 text-slate-600">
                        {candidate.experience ||
                          "Not specified"}
                      </td>

                      {/* Location */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-slate-600">

                          <MapPin size={15} />

                          {candidate.location ||
                            "Not specified"}

                        </div>

                      </td>

                      {/* Skills */}
                      <td className="px-6 py-5">

                        <div className="flex max-w-[250px] flex-wrap gap-1.5">

                          {skills.map(
                            (skill) => (
                              <span
                                key={skill}
                                className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600"
                              >
                                {skill}
                              </span>
                            )
                          )}

                        </div>

                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">

                        <select
                          value={
                            candidate.status
                          }
                          onChange={(
                            event
                          ) =>
                            updateStatus(
                              candidate.id,
                              event.target
                                .value
                            )
                          }
                          className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold outline-none ${
                            candidate.status ===
                            "Offer"
                              ? "bg-emerald-50 text-emerald-700"
                              : candidate.status ===
                                "Interview"
                              ? "bg-blue-50 text-blue-700"
                              : candidate.status ===
                                "Screening"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {statuses.map(
                            (status) => (
                              <option
                                key={
                                  status
                                }
                              >
                                {status}
                              </option>
                            )
                          )}
                        </select>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">

                        <div className="flex items-center gap-1">

                          <button
                            title="Delete candidate"
                            onClick={() =>
                              deleteCandidate(
                                candidate.id
                              )
                            }
                            className="rounded-lg p-2 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2
                              size={17}
                            />
                          </button>

                          <button
                            title="More"
                            className="rounded-lg p-2 hover:bg-slate-100"
                          >
                            <MoreHorizontal
                              size={18}
                            />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

              {!loading &&
                filteredCandidates.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-slate-500"
                    >
                      No candidates found.
                    </td>
                  </tr>
                )}

            </tbody>

          </table>

        </div>

        <div className="border-t border-slate-100 px-6 py-4">

          <p className="text-xs text-slate-500">
            Showing{" "}
            {
              filteredCandidates.length
            }{" "}
            of {candidates.length}{" "}
            candidates
          </p>

        </div>

      </div>

      {/* Add Candidate Modal */}
      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-6">

              <div>
                <h3 className="text-lg font-bold">
                  Add Candidate
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Add a candidate to your recruitment pipeline.
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
              onSubmit={addCandidate}
              className="space-y-5 p-6"
            >

              {/* Name */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Full Name *
                </label>

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateForm(
                      "name",
                      event.target.value
                    )
                  }
                  placeholder="e.g. Rahul Kumar"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  required
                />

              </div>

              {/* Email */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Email *
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateForm(
                      "email",
                      event.target.value
                    )
                  }
                  placeholder="candidate@email.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                  required
                />

              </div>

              {/* Phone */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Phone
                </label>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateForm(
                      "phone",
                      event.target.value
                    )
                  }
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />

              </div>

              {/* Location + Experience */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Location
                  </label>

                  <input
                    value={
                      form.location
                    }
                    onChange={(event) =>
                      updateForm(
                        "location",
                        event.target
                          .value
                      )
                    }
                    placeholder="Bengaluru"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    Experience
                  </label>

                  <input
                    value={
                      form.experience
                    }
                    onChange={(event) =>
                      updateForm(
                        "experience",
                        event.target
                          .value
                      )
                    }
                    placeholder="2 years"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  />

                </div>

              </div>

              {/* Skills */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Skills *
                </label>

                <input
                  value={form.skills}
                  onChange={(event) =>
                    updateForm(
                      "skills",
                      event.target.value
                    )
                  }
                  placeholder="React, TypeScript, SQL"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  required
                />

                <p className="mt-1 text-xs text-slate-400">
                  Separate multiple skills with commas.
                </p>

              </div>

              {/* Status */}
              <div>

                <label className="mb-2 block text-sm font-medium">
                  Initial Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                >
                  {statuses.map(
                    (status) => (
                      <option
                        key={status}
                      >
                        {status}
                      </option>
                    )
                  )}
                </select>

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
                    ? "Adding..."
                    : "Add Candidate"}
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

export default Candidates;