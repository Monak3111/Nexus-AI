
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowUpRight,
  CheckCircle2,
  FolderKanban,
  ListTodo,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../api";

type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
};

type Task = {
  id: number;
  project: number;
  project_name?: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date: string | null;
};

const STATUS = [
  { key: "TODO", label: "To do", color: "#94a3b8" },
  { key: "IN_PROGRESS", label: "In progress", color: "#0ea5e9" },
  { key: "IN_REVIEW", label: "In review", color: "#8b5cf6" },
  { key: "DONE", label: "Completed", color: "#10b981" },
];

const PRIORITIES = [
  { key: "LOW", label: "Low", color: "#94a3b8" },
  { key: "MEDIUM", label: "Medium", color: "#f59e0b" },
  { key: "HIGH", label: "High", color: "#f97316" },
  { key: "URGENT", label: "Urgent", color: "#ef4444" },
];

function Dashboard() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskProject, setTaskProject] = useState("");
  const [taskPriority, setTaskPriority] = useState("MEDIUM");

  const [saving, setSaving] = useState(false);

  const loadDashboard = async () => {
    setError("");

    try {
      const [projectResponse, taskResponse] = await Promise.all([
        api.get("projects/"),
        api.get("tasks/"),
      ]);

      setProjects(
        projectResponse.data.results ?? projectResponse.data
      );

      setTasks(
        taskResponse.data.results ?? taskResponse.data
      );
    } catch (err: any) {
      console.error("Dashboard loading failed:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      } else {
        setError("Unable to load workspace data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }

    loadDashboard();
  }, [navigate]);

  const completed = tasks.filter(t => t.status === "DONE").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;
  const inReview = tasks.filter(t => t.status === "IN_REVIEW").length;
  const todo = tasks.filter(t => t.status === "TODO").length;

  const completionRate = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const overdue = tasks.filter(task => {
    if (!task.due_date || task.status === "DONE") return false;

    const due = new Date(task.due_date + "T00:00:00");
    return due < today;
  }).length;

  const activeProjects = projects.filter(
    p => p.status === "ACTIVE"
  ).length;

  const statusCounts = useMemo(
    () => STATUS.map(s => ({
      ...s,
      count: tasks.filter(t => t.status === s.key).length,
    })),
    [tasks]
  );

  const priorityCounts = useMemo(
    () => PRIORITIES.map(p => ({
      ...p,
      count: tasks.filter(t => t.priority === p.key).length,
    })),
    [tasks]
  );

  const projectProgress = useMemo(
    () => projects.slice(0, 5).map(project => {
      const projectTasks = tasks.filter(
        task => task.project === project.id
      );

      const done = projectTasks.filter(
        task => task.status === "DONE"
      ).length;

      return {
        ...project,
        total: projectTasks.length,
        completed: done,
        progress: projectTasks.length
          ? Math.round((done / projectTasks.length) * 100)
          : 0,
      };
    }),
    [projects, tasks]
  );

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    setSaving(true);

    try {
      await api.post("projects/", {
        name: projectName,
        description: projectDescription,
        status: "ACTIVE",
      });

      setProjectName("");
      setProjectDescription("");
      setShowProjectModal(false);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Unable to create project.");
    } finally {
      setSaving(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!taskTitle.trim() || !taskProject) return;

    setSaving(true);

    try {
      await api.post("tasks/", {
        project: Number(taskProject),
        title: taskTitle,
        description: taskDescription,
        priority: taskPriority,
        status: "TODO",
      });

      setTaskTitle("");
      setTaskDescription("");
      setTaskProject("");
      setTaskPriority("MEDIUM");
      setShowTaskModal(false);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Unable to create task.");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!window.confirm("Delete this project and its tasks?")) return;

    try {
      await api.delete(`projects/${id}/`);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Unable to delete project.");
    }
  };

  const deleteTask = async (id: number) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      await api.delete(`tasks/${id}/`);
      await loadDashboard();
    } catch (err) {
      console.error(err);
      alert("Unable to delete task.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[450px] items-center justify-center">
        <RefreshCw className="animate-spin text-sky-500" size={30} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-10">

      {/* Header */}
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-sm font-bold text-sky-500">
            WORKSPACE OVERVIEW
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Track projects, monitor progress, and keep your team moving.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowTaskModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <Plus size={17} /> New task
          </button>

          <button
            onClick={() => setShowProjectModal(true)}
            className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            <Plus size={17} /> New project
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
          <button onClick={loadDashboard} className="font-bold">
            Retry
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total projects"
          value={projects.length}
          subtitle={`${activeProjects} currently active`}
          icon={<FolderKanban size={21} />}
          color="sky"
        />
        <StatCard
          title="Total tasks"
          value={tasks.length}
          subtitle={`${todo} waiting to start`}
          icon={<ListTodo size={21} />}
          color="violet"
        />
        <StatCard
          title="Completed tasks"
          value={completed}
          subtitle={`${completionRate}% overall completion`}
          icon={<CheckCircle2 size={21} />}
          color="emerald"
        />
        <StatCard
          title="Overdue tasks"
          value={overdue}
          subtitle="Tasks past their due date"
          icon={<AlertCircle size={21} />}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">

        {/* Task status donut */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-black text-slate-950">
              Task status
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Distribution of tasks across your workflow.
            </p>
          </div>

          <div className="flex flex-col items-center gap-7 sm:flex-row sm:justify-around">
            <div className="relative h-52 w-52 shrink-0">
              <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                <circle
                  cx="60"
                  cy="60"
                  r="45"
                  fill="none"
                  stroke="#f1f5f9"
                  strokeWidth="14"
                />

                {(() => {
                  const circumference = 2 * Math.PI * 45;
                  let offset = 0;

                  return statusCounts.map(item => {
                    const length = tasks.length
                      ? (item.count / tasks.length) * circumference
                      : 0;

                    const circle = (
                      <circle
                        key={item.key}
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke={item.color}
                        strokeWidth="14"
                        strokeDasharray={`${length} ${circumference - length}`}
                        strokeDashoffset={-offset}
                      />
                    );

                    offset += length;
                    return circle;
                  });
                })()}
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-950">
                  {tasks.length}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  Total tasks
                </span>
              </div>
            </div>

            <div className="w-full space-y-4">
              {statusCounts.map(item => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-600">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Priority chart */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-7">
            <h2 className="text-lg font-black text-slate-950">
              Task priorities
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Understand how work is prioritized.
            </p>
          </div>

          <div className="space-y-6">
            {priorityCounts.map(item => (
              <div key={item.key}>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-600">
                    {item.label}
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    {item.count}
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${tasks.length ? (item.count / tasks.length) * 100 : 0}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <Activity size={17} className="text-sky-500" />
              Workspace activity
            </div>
            <p className="mt-1 text-xs text-slate-500">
              {inProgress} tasks in progress and {inReview} awaiting review.
            </p>
          </div>
        </section>
      </div>

      {/* Project progress */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-950">
              Project progress
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Completion percentage for each project.
            </p>
          </div>
          <button
            onClick={() => navigate("/projects")}
            className="text-sm font-bold text-sky-600 hover:text-sky-700"
          >
            View all <ArrowUpRight size={15} className="inline" />
          </button>
        </div>

        {projectProgress.length === 0 ? (
          <EmptyState text="Create your first project to see progress here." />
        ) : (
          <div className="space-y-6">
            {projectProgress.map(project => (
              <div key={project.id}>
                <div className="mb-2 flex flex-col justify-between gap-2 sm:flex-row">
                  <span className="text-sm font-bold text-slate-800">
                    {project.name}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {project.completed}/{project.total} tasks completed · {project.progress}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-sky-500 transition-all duration-700"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent projects and tasks */}
      <div className="grid gap-6 xl:grid-cols-2">

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="font-black text-slate-950">Recent projects</h2>
              <p className="mt-1 text-xs text-slate-500">
                Your latest workspace projects.
              </p>
            </div>
            <button
              onClick={() => navigate("/projects")}
              className="text-sm font-bold text-sky-600"
            >
              View all
            </button>
          </div>

          {projects.length === 0 ? (
            <EmptyState text="No projects yet." />
          ) : (
            <div className="divide-y divide-slate-100">
              {projects.slice(0, 5).map(project => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="flex cursor-pointer items-center justify-between gap-3 p-5 hover:bg-slate-50"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                      <FolderKanban size={19} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">
                        {project.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {project.description || "No description"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-6">
            <div>
              <h2 className="font-black text-slate-950">Recent tasks</h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest work across your projects.
              </p>
            </div>
            <button
              onClick={() => navigate("/tasks")}
              className="text-sm font-bold text-sky-600"
            >
              View all
            </button>
          </div>

          {tasks.length === 0 ? (
            <EmptyState text="No tasks yet." />
          ) : (
            <div className="divide-y divide-slate-100">
              {tasks.slice(0, 6).map(task => (
                <div key={task.id} className="flex items-start gap-3 p-5">
                  <div className="mt-1 rounded-lg bg-sky-50 p-2 text-sky-600">
                    <ListTodo size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {task.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {task.project_name ||
                        projects.find(p => p.id === task.project)?.name ||
                        "Project"}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <span className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] font-bold text-sky-700">
                        {task.status.replace("_", " ")}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="rounded-lg p-2 text-slate-300 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Project modal */}
      {showProjectModal && (
        <Modal title="Create project" onClose={() => setShowProjectModal(false)}>
          <form onSubmit={createProject} className="space-y-4">
            <Field label="Project name">
              <input
                required
                value={projectName}
                onChange={e => setProjectName(e.target.value)}
                placeholder="e.g. Mobile App Development"
                className="form-input"
              />
            </Field>
            <Field label="Description">
              <textarea
                value={projectDescription}
                onChange={e => setProjectDescription(e.target.value)}
                placeholder="Describe your project..."
                rows={3}
                className="form-input"
              />
            </Field>
            <ModalButtons saving={saving} onCancel={() => setShowProjectModal(false)} />
          </form>
        </Modal>
      )}

      {/* Task modal */}
      {showTaskModal && (
        <Modal title="Create task" onClose={() => setShowTaskModal(false)}>
          <form onSubmit={createTask} className="space-y-4">
            <Field label="Task title">
              <input
                required
                value={taskTitle}
                onChange={e => setTaskTitle(e.target.value)}
                placeholder="e.g. Build checkout API"
                className="form-input"
              />
            </Field>

            <Field label="Project">
              <select
                required
                value={taskProject}
                onChange={e => setTaskProject(e.target.value)}
                className="form-input"
              >
                <option value="">Select project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Priority">
              <select
                value={taskPriority}
                onChange={e => setTaskPriority(e.target.value)}
                className="form-input"
              >
                {PRIORITIES.map(p => (
                  <option key={p.key} value={p.key}>{p.label}</option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                value={taskDescription}
                onChange={e => setTaskDescription(e.target.value)}
                placeholder="Describe the task..."
                rows={3}
                className="form-input"
              />
            </Field>

            <ModalButtons saving={saving} onCancel={() => setShowTaskModal(false)} />
          </form>
        </Modal>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}) {
  const colors: Record<string, string> = {
    sky: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className={`rounded-xl p-3 ${colors[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-400">
          NEXUS
        </span>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-black text-slate-950">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{subtitle}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="p-10 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-950">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </span>
      {children}
    </label>
  );
}

function ModalButtons({
  saving,
  onCancel,
}: {
  saving: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="flex gap-3 pt-2">
      <button
        type="button"
        onClick={onCancel}
        className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="flex-1 rounded-xl bg-slate-950 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Create"}
      </button>
    </div>
  );
}

export default Dashboard;
