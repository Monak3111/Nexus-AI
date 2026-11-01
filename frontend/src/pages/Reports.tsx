import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Loader2,
  TrendingUp,
} from "lucide-react";
import api from "../api";

type Project = {
  id: number;
  name: string;
  status: string;
};

type Task = {
  id: number;
  title: string;
  project: number;
  project_name: string;
  status: string;
  priority: string;
  due_date: string | null;
};

function Reports() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const [projectsResponse, tasksResponse] = await Promise.all([
          api.get("projects/"),
          api.get("tasks/"),
        ]);

        setProjects(projectsResponse.data);
        setTasks(tasksResponse.data);
      } catch (error: any) {
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login";
        }

        console.error("Failed to load reports:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!localStorage.getItem("access_token")) {
      window.location.href = "/login";
      return;
    }

    loadReports();
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "DONE",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "IN_PROGRESS",
  ).length;

  const todoTasks = tasks.filter(
    (task) => task.status === "TODO",
  ).length;

  const reviewTasks = tasks.filter(
    (task) => task.status === "IN_REVIEW",
  ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const projectStats = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter(
        (task) => task.project === project.id,
      );

      const completed = projectTasks.filter(
        (task) => task.status === "DONE",
      ).length;

      const percentage =
        projectTasks.length === 0
          ? 0
          : Math.round((completed / projectTasks.length) * 100);

      return {
        ...project,
        total: projectTasks.length,
        completed,
        percentage,
      };
    });
  }, [projects, tasks]);

  const priorityStats = [
    {
      label: "Urgent",
      value: tasks.filter((task) => task.priority === "URGENT").length,
    },
    {
      label: "High",
      value: tasks.filter((task) => task.priority === "HIGH").length,
    },
    {
      label: "Medium",
      value: tasks.filter((task) => task.priority === "MEDIUM").length,
    },
    {
      label: "Low",
      value: tasks.filter((task) => task.priority === "LOW").length,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 text-zinc-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading reports...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-medium text-sky-500">Workspace</p>

        <h1 className="mt-1 text-3xl font-bold tracking-tight text-zinc-950">
          Reports
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Understand project progress and team workload.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total projects"
          value={projects.length}
          icon={<FolderKanban className="h-5 w-5" />}
        />

        <StatCard
          title="Total tasks"
          value={totalTasks}
          icon={<BarChart3 className="h-5 w-5" />}
        />

        <StatCard
          title="Completed"
          value={completedTasks}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />

        <StatCard
          title="Completion rate"
          value={`${completionRate}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-950">
                Task overview
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Current distribution of your tasks.
              </p>
            </div>

            <BarChart3 className="h-5 w-5 text-sky-500" />
          </div>

          <div className="mt-6 space-y-5">
            <ProgressRow
              label="Completed"
              value={completedTasks}
              total={totalTasks}
            />

            <ProgressRow
              label="In progress"
              value={inProgressTasks}
              total={totalTasks}
            />

            <ProgressRow
              label="In review"
              value={reviewTasks}
              total={totalTasks}
            />

            <ProgressRow
              label="To do"
              value={todoTasks}
              total={totalTasks}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-zinc-950">
                Priority breakdown
              </h2>

              <p className="mt-1 text-sm text-zinc-500">
                Tasks grouped by priority.
              </p>
            </div>

            <Clock3 className="h-5 w-5 text-amber-500" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            {priorityStats.map((item) => (
              <div
                key={item.label}
                className="rounded-2xl bg-zinc-50 p-5"
              >
                <p className="text-sm text-zinc-500">{item.label}</p>

                <p className="mt-2 text-3xl font-bold text-zinc-950">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white">
        <div className="border-b border-zinc-100 p-6">
          <h2 className="font-semibold text-zinc-950">
            Project performance
          </h2>

          <p className="mt-1 text-sm text-zinc-500">
            Progress across each project.
          </p>
        </div>

        {projectStats.length === 0 ? (
          <div className="p-12 text-center">
            <FolderKanban className="mx-auto h-8 w-8 text-zinc-300" />

            <p className="mt-3 text-sm text-zinc-500">
              No projects available yet.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {projectStats.map((project) => (
              <div
                key={project.id}
                className="p-6 transition hover:bg-zinc-50/70"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-950">
                      {project.name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      {project.completed} of {project.total} tasks
                      completed
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-zinc-950">
                      {project.percentage}%
                    </p>

                    <p className="text-xs text-zinc-400">
                      complete
                    </p>
                  </div>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className="h-full rounded-full bg-sky-400 transition-all"
                    style={{
                      width: `${project.percentage}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-zinc-500">{title}</span>

        <div className="text-sky-500">{icon}</div>
      </div>

      <p className="mt-3 text-3xl font-bold text-zinc-950">
        {value}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  total,
}: {
  label: string;
  value: number;
  total: number;
}) {
  const percentage =
    total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-700">
          {label}
        </span>

        <span className="text-sm text-zinc-500">
          {value} ({percentage}%)
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
        <div
          className="h-full rounded-full bg-sky-400 transition-all"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default Reports;