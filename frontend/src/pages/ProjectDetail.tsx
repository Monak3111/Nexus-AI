import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Trash2,
  CircleDot,
} from "lucide-react";
import api from "../api";

type Project = {
  id: number;
  name: string;
  description: string;
  manager_name: string;
  status: string;
  created_at: string;
};

type Task = {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to_name: string | null;
};

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProject = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        api.get(`projects/${id}/`),
        api.get("tasks/"),
      ]);

      setProject(projectResponse.data);

      const projectTasks = tasksResponse.data.filter(
        (task: any) => String(task.project) === String(id),
      );

      setTasks(projectTasks);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
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

    loadProject();
  }, [id]);

  const deleteTask = async (taskId: number) => {
    if (!window.confirm("Delete this task?")) {
      return;
    }

    try {
      await api.delete(`tasks/${taskId}/`);

      setTasks((current) =>
        current.filter((task) => task.id !== taskId),
      );
    } catch {
      alert("Unable to delete task.");
    }
  };

  const updateTaskStatus = async (
    taskId: number,
    status: string,
  ) => {
    try {
      const response = await api.patch(`tasks/${taskId}/`, {
        status,
      });

      setTasks((current) =>
        current.map((task) =>
          task.id === taskId ? response.data : task,
        ),
      );
    } catch {
      alert("Unable to update task.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="text-sm font-semibold text-zinc-500">
          Loading project...
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50">
        <h1 className="text-2xl font-black text-zinc-950">
          Project not found
        </h1>

        <Link
          to="/dashboard"
          className="mt-4 text-sm font-bold text-sky-500"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  const completion =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const statusClass =
    project.status === "COMPLETED"
      ? "bg-emerald-50 text-emerald-700"
      : project.status === "ON_HOLD"
        ? "bg-amber-50 text-amber-700"
        : "bg-sky-50 text-sky-700";

  const priorityClass = (priority: string) => {
    if (priority === "URGENT") {
      return "bg-red-50 text-red-600";
    }

    if (priority === "HIGH") {
      return "bg-orange-50 text-orange-600";
    }

    if (priority === "MEDIUM") {
      return "bg-yellow-50 text-yellow-700";
    }

    return "bg-zinc-100 text-zinc-600";
  };

  const taskStatusClass = (status: string) => {
    if (status === "DONE") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "IN_PROGRESS") {
      return "bg-sky-50 text-sky-700";
    }

    if (status === "IN_REVIEW") {
      return "bg-violet-50 text-violet-700";
    }

    return "bg-zinc-100 text-zinc-600";
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm font-bold text-zinc-600 transition hover:text-zinc-950"
          >
            <ArrowLeft size={18} />
            Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-400 font-black text-zinc-950">
              N
            </div>

            <span className="font-black tracking-tight text-zinc-950">
              nexus
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="rounded-2xl border border-zinc-200 bg-white p-7 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass}`}
                >
                  {project.status.replace("_", " ")}
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-zinc-950">
                {project.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
                {project.description ||
                  "No project description has been added yet."}
              </p>

              <p className="mt-5 text-sm text-zinc-500">
                Managed by{" "}
                <span className="font-bold text-zinc-800">
                  {project.manager_name}
                </span>
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50"
            >
              Back
            </button>
          </div>
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100">
              <CircleDot size={19} />
            </div>

            <p className="text-sm text-zinc-500">
              Total tasks
            </p>

            <p className="mt-1 text-3xl font-black text-zinc-950">
              {totalTasks}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50">
              <Clock3 size={19} className="text-sky-500" />
            </div>

            <p className="text-sm text-zinc-500">
              In progress
            </p>

            <p className="mt-1 text-3xl font-black text-zinc-950">
              {inProgressTasks}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <CheckCircle2
                size={19}
                className="text-emerald-500"
              />
            </div>

            <p className="text-sm text-zinc-500">
              Completed
            </p>

            <p className="mt-1 text-3xl font-black text-zinc-950">
              {completedTasks}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-500">
              Completion
            </p>

            <p className="mt-1 text-3xl font-black text-zinc-950">
              {completion}%
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-sky-400 transition-all"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-black text-zinc-950">
              Project tasks
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Manage the work belonging to this project.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
            {tasks.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-100">
                  <CheckCircle2 size={22} />
                </div>

                <h3 className="mt-4 font-bold text-zinc-950">
                  No tasks yet
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  Create a task from the dashboard to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-100">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-zinc-950">
                          {task.title}
                        </h3>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${priorityClass(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.description && (
                        <p className="mt-1 max-w-2xl truncate text-sm text-zinc-500">
                          {task.description}
                        </p>
                      )}

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-zinc-400">
                        {task.assigned_to_name && (
                          <span>
                            Assigned to{" "}
                            <span className="font-semibold text-zinc-600">
                              {task.assigned_to_name}
                            </span>
                          </span>
                        )}

                        {task.due_date && (
                          <span>
                            Due {task.due_date}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={task.status}
                        onChange={(e) =>
                          updateTaskStatus(
                            task.id,
                            e.target.value,
                          )
                        }
                        className={`rounded-xl border-0 px-3 py-2 text-xs font-bold outline-none ${taskStatusClass(task.status)}`}
                      >
                        <option value="TODO">
                          TO DO
                        </option>

                        <option value="IN_PROGRESS">
                          IN PROGRESS
                        </option>

                        <option value="IN_REVIEW">
                          IN REVIEW
                        </option>

                        <option value="DONE">
                          DONE
                        </option>
                      </select>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-50 hover:text-red-500"
                        title="Delete task"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default ProjectDetail;