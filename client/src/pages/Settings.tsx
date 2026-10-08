import {
  Bell,
  Building2,
  Lock,
  Save,
  UserRound,
} from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your HireFlow account and application settings.
        </p>
      </div>

      {/* Profile */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Profile</h2>
            <p className="text-sm text-slate-500">
              Update your personal information.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Full Name
            </label>
            <input
              type="text"
              defaultValue="Umakant"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              defaultValue="umakant@example.com"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Job Title
            </label>
            <input
              type="text"
              defaultValue="HR Administrator"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Phone
            </label>
            <input
              type="text"
              placeholder="+91 XXXXX XXXXX"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>
      </section>

      {/* Company */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <Building2 size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Company</h2>
            <p className="text-sm text-slate-500">
              Configure your organization details.
            </p>
          </div>
        </div>

        <div className="grid gap-5 p-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Company Name
            </label>
            <input
              type="text"
              defaultValue="HireFlow Technologies"
              className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Industry
            </label>
            <select className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-500">
              <option>Information Technology</option>
              <option>Finance</option>
              <option>Healthcare</option>
              <option>Education</option>
              <option>Retail</option>
            </select>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
            <Bell size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Notifications</h2>
            <p className="text-sm text-slate-500">
              Choose which notifications you receive.
            </p>
          </div>
        </div>

        <div className="space-y-5 p-6">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">
                New applications
              </p>
              <p className="text-xs text-slate-500">
                Get notified when candidates apply for jobs.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-blue-600"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Interview reminders
              </p>
              <p className="text-xs text-slate-500">
                Receive reminders before scheduled interviews.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-blue-600"
            />
          </label>

          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-800">
                Weekly recruitment summary
              </p>
              <p className="text-xs text-slate-500">
                Receive a weekly overview of hiring activity.
              </p>
            </div>

            <input
              type="checkbox"
              defaultChecked
              className="h-4 w-4 accent-blue-600"
            />
          </label>
        </div>
      </section>

      {/* Security */}
      <section className="rounded-xl border border-slate-200 bg-white">
        <div className="flex items-center gap-3 border-b border-slate-200 px-6 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <Lock size={20} />
          </div>

          <div>
            <h2 className="font-semibold text-slate-900">Security</h2>
            <p className="text-sm text-slate-500">
              Manage your account security.
            </p>
          </div>
        </div>

        <div className="p-6">
          <button className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Change Password
          </button>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
          <Save size={17} />
          Save Changes
        </button>
      </div>
    </div>
  );
}