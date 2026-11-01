import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  FileText,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import api from "../api";

type Project = {
  id: number;
  name: string;
};

type User = {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
};

type Task = {
  id: number;
  project: number;
  project_name: string;
  title: string;
  description: string;
  assigned_to: number | null;
  assigned_to_name: string | null;
  status: string;
  priority: string;
  due_date: string | null;
};

const statusLabels: Record<string, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  IN_REVIEW: "In Review",
  DONE: "Done",
};

const priorityLabels: Record<string, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  URGENT: "Urgent",
};

function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [filter, setFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const loadData = async () => {
    try {
      const [tasksResponse, projectsResponse, usersResponse] =
        await Promise.all([
          api.get("tasks/"),
          api.get("projects/"),
          api.get("auth/users/"),
        ]);

      setTasks(tasksResponse.data);
      setProjects(projectsResponse.data);
      setUsers(usersResponse.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
      }

      console.error("Failed to load task data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }

    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    if (filter === "ALL") {
      return tasks;
    }

    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const createTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim() || !projectId) {
      return;
    }

    try {
      setSaving(true);

      await api.post("tasks/", {
        title,
        description,
        project: Number(projectId),
        assigned_to: assignedTo ? Number(assignedTo) : null,
        priority,
        due_date: dueDate || null,
      });

      setTitle("");
      setDescription("");
      setProjectId("");
      setAssignedTo("");
      setPriority("MEDIUM");
      setDueDate("");

      setShowModal(false);

      await loadData();
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateStatus = async (taskId: number, status: string) => {
    try {
      await api.patch(`tasks/${taskId}/`, {
        status,
      });

      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status,
              }
            : task,
        ),
      );
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const deleteTask = async (taskId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`tasks/${taskId}/`);

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== taskId),
      );
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const completedCount = tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  const reviewCount = tasks.filter(
    (task) => task.status === "IN_REVIEW",
  ).length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading tasks...
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
            Tasks
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Manage work across all your projects.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          <Plus className="h-4 w-4" />
          New task
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">In progress</span>
            <Clock3 className="h-5 w-5 text-sky-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-zinc-950">
            {inProgressCount}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">In review</span>
            <FileText className="h-5 w-5 text-amber-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-zinc-950">
            {reviewCount}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Completed</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>

          <p className="mt-3 text-3xl font-bold text-zinc-950">
            {completedCount}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          ["ALL", "All tasks"],
          ["TODO", "To do"],
          ["IN_PROGRESS", "In progress"],
          ["IN_REVIEW", "In review"],
          ["DONE", "Done"],
        ].map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === value
                ? "bg-zinc-950 text-white"
                : "border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {filteredTasks.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-100">
              <CheckCircle2 className="h-6 w-6 text-zinc-400" />
            </div>

            <h3 className="mt-4 text-lg font-semibold text-zinc-950">
              No tasks found
            </h3>

            <p className="mt-1 text-sm text-zinc-500">
              Create a task to start tracking work.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-5 p-5 transition hover:bg-zinc-50/70 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-zinc-950">
                      {task.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        task.priority === "URGENT"
                          ? "bg-red-100 text-red-700"
                          : task.priority === "HIGH"
                            ? "bg-orange-100 text-orange-700"
                            : task.priority === "MEDIUM"
                              ? "bg-sky-100 text-sky-700"
                              : "bg-zinc-100 text-zinc-600"
                      }`}
                    >
                      {priorityLabels[task.priority] || task.priority}
                    </span>
                  </div>

                  {task.description && (
                    <p className="mt-2 max-w-2xl text-sm text-zinc-500">
                      {task.description}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                    <Link
                      to={`/projects/${task.project}`}
                      className="font-medium text-sky-600 hover:text-sky-700"
                    >
                      {task.project_name}
                    </Link>

                    {task.assigned_to_name && (
                      <>
                        <span>•</span>
                        <span>Assigned to {task.assigned_to_name}</span>
                      </>
                    )}

                    {task.due_date && (
                      <>
                        <span>•</span>
                        <span>Due {task.due_date}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={task.status}
                    onChange={(event) =>
                      updateStatus(task.id, event.target.value)
                    }
                    className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 outline-none focus:border-sky-400"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="IN_REVIEW">In Review</option>
                    <option value="DONE">Done</option>
                  </select>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="rounded-xl border border-zinc-200 p-2.5 text-zinc-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    title="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="hidden text-xs font-medium text-zinc-400 lg:block">
                  {statusLabels[task.status] || task.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-zinc-950">
                  Create task
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                  Add a new piece of work to your workspace.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={createTask} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-800">
                  Task title
                </label>

                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="e.g. Build authentication API"
                  className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-800">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Describe the task..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-800">
                  Project
                </label>

                <select
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  required
                >
                  <option value="">Select a project</option>

                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-800">
                    Priority
                  </label>

                  <select
                    value={priority}
                    onChange={(event) => setPriority(event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-zinc-800">
                    Due date
                  </label>

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-zinc-800">
                  Assign to
                </label>

                <select
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-sky-400"
                >
                  <option value="">Unassigned</option>

                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.first_name || user.last_name
                        ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
                        : user.username}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 py-3 text-sm font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  Create task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;