import { useState, type ReactNode } from "react";

import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronRight,
  Menu,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";

function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-950">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
          {/* LOGO */}
          <a href="#" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 text-xl font-black text-zinc-950 shadow-[0_8px_30px_rgba(56,189,248,0.35)]">
              N
            </div>

            <span className="text-xl font-black tracking-[-0.04em]">
              nexus
            </span>
          </a>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-8 lg:flex">
            <a
              href="#product"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Product
            </a>

            <a
              href="#solutions"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Solutions
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-zinc-600 transition hover:text-zinc-950"
            >
              About
            </a>
          </nav>

          {/* SEARCH */}
          <div className="hidden w-56 items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 md:flex">
            <Search size={17} className="text-zinc-400" />

            <input
              type="text"
              placeholder="Search Nexus"
              className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
            />

            <span className="rounded-md border border-zinc-200 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-zinc-400">
              /
            </span>
          </div>

          {/* ACTIONS */}
          <div className="hidden items-center gap-3 sm:flex">
            <a
              href="/login"
              className="rounded-full px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            >
              Log in
            </a>

            <a
              href="/login"
              className="group flex items-center gap-2 rounded-full bg-zinc-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Get started
              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-zinc-800 sm:hidden"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* MOBILE NAV */}
        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 bg-white px-5 py-5 sm:hidden">
            <div className="flex flex-col gap-4">
              <a href="#product" className="font-medium">
                Product
              </a>

              <a href="#solutions" className="font-medium">
                Solutions
              </a>

              <a href="#features" className="font-medium">
                Features
              </a>

              <a href="#about" className="font-medium">
                About
              </a>

              <a
                href="/login"
                className="mt-2 rounded-full bg-zinc-950 px-5 py-3 text-center font-semibold text-white"
              >
                Get started
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="absolute left-1/2 top-0 -z-10 h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="mx-auto max-w-7xl px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-10 lg:pb-32">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-700">
                <Sparkles size={15} />
                Work management, reimagined
                <ChevronRight size={15} />
              </div>

              <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.06em] text-zinc-950 sm:text-6xl lg:text-8xl">
                Move work
                <br />
                <span className="text-sky-400">forward.</span>
              </h1>

              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg">
                Nexus gives modern teams one powerful place to plan projects,
                manage tasks, collaborate with people, and turn ideas into
                meaningful outcomes.
              </p>

              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="/login"
                  className="group flex items-center justify-center gap-2 rounded-full bg-zinc-950 px-7 py-4 font-bold text-white shadow-xl shadow-zinc-950/10 transition hover:-translate-y-0.5 hover:bg-zinc-800"
                >
                  Start building
                  <ArrowRight
                    size={17}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>

                <a
                  href="#features"
                  className="rounded-full border border-zinc-300 bg-white px-7 py-4 text-center font-bold text-zinc-900 transition hover:border-zinc-500 hover:bg-zinc-50"
                >
                  Explore Nexus
                </a>
              </div>
            </div>

            {/* PRODUCT PREVIEW */}
            <div className="relative mx-auto mt-20 max-w-6xl">
              <div className="absolute -inset-4 rounded-[2rem] bg-sky-300/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.12)]">
                {/* Browser bar */}
                <div className="flex h-12 items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />

                  <div className="mx-auto hidden h-7 w-80 items-center justify-center rounded-md border border-zinc-200 bg-white text-xs text-zinc-400 sm:flex">
                    app.nexus.work
                  </div>
                </div>

                <div className="flex min-h-[420px]">
                  {/* SIDEBAR */}
                  <aside className="hidden w-56 border-r border-zinc-200 bg-zinc-950 p-5 text-white sm:block">
                    <div className="mb-8 flex items-center gap-2">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-400 text-xs font-black text-zinc-950">
                        N
                      </div>

                      <span className="font-bold">nexus</span>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="rounded-lg bg-white/10 px-3 py-2 font-semibold">
                        Overview
                      </div>

                      <div className="px-3 py-2 text-zinc-400">Projects</div>
                      <div className="px-3 py-2 text-zinc-400">My tasks</div>
                      <div className="px-3 py-2 text-zinc-400">Team</div>
                      <div className="px-3 py-2 text-zinc-400">Reports</div>
                    </div>
                  </aside>

                  {/* DASHBOARD PREVIEW */}
                  <div className="flex-1 bg-zinc-50 p-5 sm:p-8">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                          Monday, October 4
                        </p>

                        <h2 className="mt-1 text-2xl font-black tracking-tight">
                          Good morning, team.
                        </h2>
                      </div>

                      <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-sky-200 text-xs font-bold sm:flex">
                        MK
                      </div>
                    </div>

                    <div className="mt-7 grid gap-4 sm:grid-cols-3">
                      <PreviewStat
                        label="Active projects"
                        value="12"
                        change="+3 this month"
                      />

                      <PreviewStat
                        label="Tasks completed"
                        value="84"
                        change="+18.2%"
                      />

                      <PreviewStat
                        label="Team members"
                        value="28"
                        change="Across 6 teams"
                      />
                    </div>

                    <div className="mt-5 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
                      <div className="rounded-xl border border-zinc-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold">
                              Project progress
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                              Product launch
                            </p>
                          </div>

                          <BarChart3 size={18} className="text-sky-400" />
                        </div>

                        <div className="mt-7 flex h-32 items-end gap-3">
                          {[45, 65, 52, 78, 62, 88, 76, 96].map(
                            (height, index) => (
                              <div
                                key={index}
                                className="flex-1 rounded-t-md bg-sky-100"
                                style={{ height: `${height}%` }}
                              >
                                <div
                                  className="h-full rounded-t-md bg-sky-400"
                                  style={{
                                    height: `${Math.min(100, height - 12)}%`,
                                  }}
                                />
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      <div className="rounded-xl border border-zinc-200 bg-white p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-bold">My tasks</p>

                          <span className="text-xs font-semibold text-sky-500">
                            View all
                          </span>
                        </div>

                        <div className="mt-5 space-y-3">
                          <PreviewTask
                            title="Finalize landing page"
                            priority="High"
                          />

                          <PreviewTask
                            title="Review API documentation"
                            priority="Medium"
                          />

                          <PreviewTask
                            title="Prepare sprint report"
                            priority="Low"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST */}
        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10">
            <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
              Built for teams that move fast
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-lg font-black tracking-tight text-zinc-300 sm:gap-x-20">
              <span>northstar</span>
              <span>vertex</span>
              <span>arc</span>
              <span>layer</span>
              <span>studio</span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-10 lg:py-32"
        >
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-500">
              Everything connected
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              One workspace.
              <br />
              <span className="text-zinc-400">Every moving part.</span>
            </h2>

            <p className="mt-6 text-base leading-7 text-zinc-600">
              Replace scattered spreadsheets, messages, and disconnected tools
              with a single system your entire organization can use.
            </p>
          </div>

          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap size={21} />}
              title="Projects that stay on track"
              description="Give every project a clear owner, team, timeline, status, and source of truth."
            />

            <FeatureCard
              icon={<Check size={21} />}
              title="Tasks with momentum"
              description="Create, assign, prioritize, and move work through a workflow your team understands."
            />

            <FeatureCard
              icon={<Users size={21} />}
              title="Teams that collaborate"
              description="Bring people, responsibilities, conversations, and project context together."
            />

            <FeatureCard
              icon={<BarChart3 size={21} />}
              title="Reports that matter"
              description="Understand progress, workload, completion rates, and project performance."
            />

            <FeatureCard
              icon={<Search size={21} />}
              title="Find anything instantly"
              description="Search across projects, tasks, people, and work without digging through menus."
            />

            <FeatureCard
              icon={<Sparkles size={21} />}
              title="Designed to scale"
              description="A foundation built for growing teams, permissions, automation, and future workflows."
            />
          </div>
        </section>

        {/* CTA */}
        <section
          id="product"
          className="mx-auto max-w-7xl px-5 pb-24 sm:px-8 lg:px-10 lg:pb-32"
        >
          <div className="relative overflow-hidden rounded-[2rem] bg-sky-400 px-7 py-16 sm:px-12 lg:px-16">
            <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/20 blur-3xl" />

            <div className="relative max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-sky-950/70">
                Your next workspace
              </p>

              <h2 className="mt-4 text-4xl font-black leading-tight tracking-[-0.05em] text-zinc-950 sm:text-6xl">
                Stop managing work.
                <br />
                Start moving it.
              </h2>

              <p className="mt-6 max-w-xl text-base leading-7 text-sky-950/75">
                Nexus gives your team the structure and visibility to turn
                plans into progress.
              </p>

              <a
                href="/login"
                className="mt-8 flex w-fit items-center gap-2 rounded-full bg-zinc-950 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-zinc-800"
              >
                Create your workspace
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer
        id="about"
        className="border-t border-zinc-200 bg-zinc-950 text-white"
      >
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400 font-black text-zinc-950">
                  N
                </div>

                <span className="text-xl font-black tracking-[-0.04em]">
                  nexus
                </span>
              </div>

              <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-400">
                A modern workspace for teams that want to build, collaborate,
                and move forward.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-16 gap-y-8 sm:grid-cols-3">
              <FooterColumn
                title="Product"
                links={["Features", "Projects", "Tasks", "Reports"]}
              />

              <FooterColumn
                title="Company"
                links={["About", "Careers", "Contact", "Security"]}
              />

              <FooterColumn
                title="Resources"
                links={["Documentation", "Help center", "API", "Status"]}
              />
            </div>
          </div>

          <div className="mt-14 flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-zinc-500 sm:flex-row">
            <span>© 2026 Nexus. All rights reserved.</span>
            <span>Built for teams that move forward.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PreviewStat({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4">
      <p className="text-xs font-medium text-zinc-400">{label}</p>

      <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>

      <p className="mt-1 text-[11px] font-semibold text-sky-500">{change}</p>
    </div>
  );
}

function PreviewTask({
  title,
  priority,
}: {
  title: string;
  priority: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-zinc-100 p-3">
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-200">
        <Check size={12} className="text-zinc-300" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-zinc-700">
          {title}
        </p>

        <p className="mt-0.5 text-[10px] text-zinc-400">
          {priority} priority
        </p>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-2xl border border-zinc-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-[0_20px_50px_rgba(56,189,248,0.12)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-50 text-sky-500 transition group-hover:bg-sky-400 group-hover:text-zinc-950">
        {icon}
      </div>

      <h3 className="mt-7 text-lg font-black tracking-tight">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
    </div>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div>
      <p className="text-sm font-bold">{title}</p>

      <div className="mt-4 space-y-3">
        {links.map((link) => (
          <a
            key={link}
            href="#"
            className="block text-sm text-zinc-500 transition hover:text-white"
          >
            {link}
          </a>
        ))}
      </div>
    </div>
  );
}

export default Home;