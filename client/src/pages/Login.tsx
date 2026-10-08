import { type FormEvent, useState } from "react";
import {
  BriefcaseBusiness,
  Lock,
  Mail,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    "admin@hireflow.com"
  );

  const [password, setPassword] = useState(
    "demo_password"
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "hireflow_token",
        response.data.token
      );

      localStorage.setItem(
        "hireflow_user",
        JSON.stringify(
          response.data.user
        )
      );

      navigate("/");
    } catch (error: any) {
      console.error("Login error:", error);

      setError(
        error?.response?.data?.message ||
          "Unable to login. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-xl font-bold text-white">
            H
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Welcome to HireFlow
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to your recruitment workspace.
          </p>

        </div>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Email */}
          <div className="mb-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-slate-400">

              <Mail
                size={17}
                className="text-slate-400"
              />

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="you@company.com"
                className="w-full py-3 text-sm outline-none"
                required
              />

            </div>

          </div>

          {/* Password */}
          <div className="mb-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 focus-within:border-slate-400">

              <Lock
                size={17}
                className="text-slate-400"
              />

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="••••••••"
                className="w-full py-3 text-sm outline-none"
                required
              />

            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <BriefcaseBusiness size={17} />

            {loading
              ? "Signing in..."
              : "Sign In"}
          </button>

          {/* Demo credentials */}
          <div className="mt-5 rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-semibold text-slate-700">
              Demo Account
            </p>

            <div className="mt-2 space-y-1 text-xs text-slate-500">
              <p>
                Email: admin@hireflow.com
              </p>

              <p>
                Password: demo_password
              </p>
            </div>

          </div>

        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          HireFlow — Applicant Tracking System
        </p>

      </div>

    </div>
  );
}

export default Login;