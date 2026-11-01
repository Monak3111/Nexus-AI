import { useEffect, useState } from "react";
import {
  Check,
  Loader2,
  Mail,
  Save,
  Shield,
  User,
} from "lucide-react";
import api from "../api";

type Profile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
};

function Settings() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await api.get("auth/profile/");

        setProfile(response.data);
        setFirstName(response.data.first_name || "");
        setLastName(response.data.last_name || "");
        setEmail(response.data.email || "");
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }

        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }

    loadProfile();
  }, []);

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setSaving(true);
      setSaved(false);

      const response = await api.patch("auth/profile/", {
        first_name: firstName,
        last_name: lastName,
        email,
      });

      setProfile(response.data);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading settings...
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const initials =
    `${profile.first_name?.charAt(0) || ""}${profile.last_name?.charAt(0) || ""}`
      .toUpperCase() || profile.username.charAt(0).toUpperCase();

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <p className="text-sm font-medium text-sky-500">Workspace</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          Settings
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Manage your profile and account preferences.
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
              {initials}
            </div>

            <div>
              <h2 className="font-semibold text-zinc-950">
                {profile.first_name || profile.last_name
                  ? `${profile.first_name} ${profile.last_name}`.trim()
                  : profile.username}
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                {profile.email}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={saveProfile} className="p-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                First name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                <input
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  className="w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Last name
              </label>

              <input
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-zinc-800">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {saved && (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-600">
                  <Check className="h-4 w-4" />
                  Profile updated successfully
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}

              Save changes
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50">
            <Shield className="h-5 w-5 text-sky-500" />
          </div>

          <div>
            <h2 className="font-semibold text-zinc-950">
              Account information
            </h2>

            <div className="mt-4 space-y-2 text-sm">
              <p className="text-zinc-500">
                Username:{" "}
                <span className="font-medium text-zinc-800">
                  {profile.username}
                </span>
              </p>

              <p className="text-zinc-500">
                Role:{" "}
                <span className="font-medium text-zinc-800">
                  {profile.role || "Employee"}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;