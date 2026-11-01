import { useEffect, useState } from "react";
import {
  Loader2,
  Mail,
  Search,
  Shield,
  UserPlus,
  Users,
} from "lucide-react";
import api from "../api";

type User = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role?: string;
};

function Team() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("auth/users/");
        setUsers(response.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }

        console.error("Failed to load team:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }

    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const value = search.toLowerCase();

    return (
      user.username.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.first_name.toLowerCase().includes(value) ||
      user.last_name.toLowerCase().includes(value)
    );
  });

  const getInitials = (user: User) => {
    const first = user.first_name?.charAt(0) || "";
    const last = user.last_name?.charAt(0) || "";

    if (first || last) {
      return `${first}${last}`.toUpperCase();
    }

    return user.username.charAt(0).toUpperCase();
  };

  const getName = (user: User) => {
    const name = `${user.first_name || ""} ${user.last_name || ""}`.trim();

    return name || user.username;
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading team...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-sky-500">Workspace</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
            Team
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage the people working across your Nexus workspace.
          </p>
        </div>

        <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
          <UserPlus className="h-4 w-4" />
          Invite member
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Team members</span>
            <Users className="h-5 w-5 text-sky-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-zinc-950">
            {users.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Managers</span>
            <Shield className="h-5 w-5 text-violet-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-zinc-950">
            {users.filter((user) => user.role === "MANAGER").length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Employees</span>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-zinc-950">
            {users.filter((user) => user.role === "EMPLOYEE").length}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="flex flex-col gap-4 border-b border-zinc-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-zinc-950">Workspace members</h2>

            <p className="mt-1 text-sm text-zinc-500">
              People with access to this workspace.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search members..."
              className="w-full rounded-xl border border-zinc-200 py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100 sm:w-64"
            />
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
              <Users className="h-6 w-6 text-zinc-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-zinc-950">
              No members found
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Try changing your search.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-zinc-50/70 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sky-100 font-bold text-sky-700">
                    {getInitials(user)}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-zinc-950">
                      {getName(user)}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                      <Mail className="h-3.5 w-3.5" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-600">
                    {user.role || "Employee"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Team;