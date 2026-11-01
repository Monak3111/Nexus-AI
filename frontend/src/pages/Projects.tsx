import { useEffect, useState } from "react";
import {
  FolderKanban,
  Plus,
  Search,
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
  manager_name?: string;
  created_at?: string;
};

function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectStatus, setProjectStatus] = useState("ACTIVE");

  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      navigate("/login");
      return;
    }

    loadProjects();
  }, [navigate]);

  const loadProjects = async () => {
    try {
      const response = await api.get("projects/");

      setProjects(
        response.data.results ?? response.data,
      );
    } catch (error: any) {
      console.error("Projects loading failed:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (
    e: React.FormEvent,
  ) => {
    e.preventDefault();

    setError("");
    setCreating(true);

    try {
      const response = await api.post(
        "projects/",
        {
          name: projectName,
          description: projectDescription,
          status: projectStatus,
        },
      );

      setProjects((currentProjects) => [
        response.data,
        ...currentProjects,
      ]);

      setProjectName("");
      setProjectDescription("");
      setProjectStatus("ACTIVE");

      setShowModal(false);
    } catch (error: any) {
      console.error(
        "Project creation failed:",
        error,
      );

      if (error.response?.data) {
        const data = error.response.data;

        if (data.name) {
          setError(data.name[0]);
        } else {
          setError("Unable to create project.");
        }
      } else {
        setError("Unable to connect to the server.");
      }
    } finally {
      setCreating(false);
    }
  };

  const deleteProject = async (
    projectId: number,
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this project?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `projects/${projectId}/`,
      );

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== projectId,
        ),
      );
    } catch (error) {
      console.error(
        "Project deletion failed:",
        error,
      );

      alert("Unable to delete this project.");
    }
  };

  const filteredProjects = projects.filter(
    (project) =>
      project.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      project.description
        ?.toLowerCase()
        .includes(search.toLowerCase()),
  );

  const statusLabel = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "Active";
      case "COMPLETED":
        return "Completed";
      case "ON_HOLD":
        return "On Hold";
      default:
        return status;
    }
  };

  const statusClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-600";
      case "COMPLETED":
        return "bg-sky-50 text-sky-600";
      case "ON_HOLD":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="mb-2 text-sm font-semibold text-sky-500">
            Workspace
          </p>

          <h1 className="text-3xl font-black tracking-tight text-slate-950">
            Projects
          </h1>

          <p className="mt-2 text-slate-500">
            Organize your work and keep every project moving.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowModal(true);
          }}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          New project
        </button>
      </div>

      {/* Search */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
          />
        </div>

        <p className="text-sm font-medium text-slate-400">
          {filteredProjects.length}{" "}
          {filteredProjects.length === 1
            ? "project"
            : "projects"}
        </p>
      </div>

      {/* Projects */}
      {loading ? (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-sky-500" />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading projects...
          </p>
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <FolderKanban
              size={28}
              className="text-slate-400"
            />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            {search
              ? "No projects found"
              : "No projects yet"}
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {search
              ? "Try changing your search."
              : "Create your first project to start organizing your work."}
          </p>

          {!search && (
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Create project
            </button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() =>
                navigate(`/projects/${project.id}`)
              }
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500">
                  <FolderKanban size={21} />
                </div>

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(
                    project.status,
                  )}`}
                >
                  {statusLabel(project.status)}
                </span>
              </div>

              <h3 className="mt-6 text-lg font-black text-slate-950 transition group-hover:text-sky-600">
                {project.name}
              </h3>

              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                {project.description ||
                  "No description available."}
              </p>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Manager
                  </p>

                  <p className="mt-1 text-xs font-semibold text-slate-600">
                    {project.manager_name ||
                      "Workspace manager"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProject(project.id);
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-5 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-slate-950">
                  Create project
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Add a new project to your workspace.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={createProject}
              className="mt-7 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Project name
                </label>

                <input
                  type="text"
                  value={projectName}
                  onChange={(e) =>
                    setProjectName(e.target.value)
                  }
                  placeholder="e.g. Nexus E-Commerce Platform"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  value={projectDescription}
                  onChange={(e) =>
                    setProjectDescription(
                      e.target.value,
                    )
                  }
                  placeholder="What is this project about?"
                  rows={4}
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Status
                </label>

                <select
                  value={projectStatus}
                  onChange={(e) =>
                    setProjectStatus(e.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="ACTIVE">
                    Active
                  </option>

                  <option value="ON_HOLD">
                    On Hold
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>
                </select>
              </div>

              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  className="flex-1 rounded-xl border border-slate-200 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 rounded-xl bg-slate-950 py-3.5 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {creating
                    ? "Creating..."
                    : "Create project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;