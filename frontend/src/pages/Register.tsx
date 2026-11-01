import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";

function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/register/",
        {
          username: email,
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        },
      );

      const loginResponse = await axios.post(
        "http://127.0.0.1:8000/api/auth/login/",
        {
          username: email,
          password,
        },
      );

      localStorage.setItem(
        "access_token",
        loginResponse.data.access,
      );

      localStorage.setItem(
        "refresh_token",
        loginResponse.data.refresh,
      );

      navigate("/dashboard");
    } catch (error: any) {
      if (error.response?.data) {
        const data = error.response.data;

        if (data.email) {
          setError(data.email[0]);
        } else if (data.username) {
          setError(data.username[0]);
        } else if (data.password) {
          setError(data.password[0]);
        } else if (data.detail) {
          setError(data.detail);
        } else {
          setError("Registration failed. Please check your details.");
        }
      } else {
        setError(
          "Unable to connect to the server. Make sure Django is running.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="grid min-h-screen lg:grid-cols-2">

        <div className="hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between p-12 text-white">

          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 font-black text-zinc-950">
              N
            </div>

            <span className="text-xl font-black tracking-tight">
              nexus
            </span>
          </Link>

          <div className="max-w-lg">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-sky-400">
              Get started
            </p>

            <h1 className="text-5xl font-black leading-tight tracking-[-0.05em]">
              Build better
              <br />
              <span className="text-sky-400">together.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-zinc-400">
              Bring projects, tasks, people, and progress together in one
              powerful workspace.
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            © 2026 Nexus. All rights reserved.
          </p>
        </div>

        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <div className="mb-10 flex justify-center lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 font-black text-zinc-950">
                  N
                </div>

                <span className="text-xl font-black tracking-tight">
                  nexus
                </span>
              </Link>
            </div>

            <div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-950">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Start managing your work with Nexus.
              </p>
            </div>

            <form
              onSubmit={handleRegister}
              className="mt-8 space-y-5"
            >

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    First name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                    />

                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) =>
                        setFirstName(e.target.value)
                      }
                      placeholder="John"
                      required
                      className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-700">
                    Last name
                  </label>

                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) =>
                      setLastName(e.target.value)
                    }
                    placeholder="Doe"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  />
                </div>

              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-700">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(e.target.value)
                    }
                    placeholder="Repeat your password"
                    required
                    className="w-full rounded-xl border border-zinc-200 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-400/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Creating account..."
                  : "Create account"}

                {!loading && (
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-zinc-950 hover:text-sky-500"
              >
                Sign in
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
