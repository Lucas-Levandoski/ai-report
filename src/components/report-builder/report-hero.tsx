import type { ReportSummary } from "@/models/report";

type ReportView = "submit" | "dashboard";

type ReportHeroProps = {
  activeView: ReportView;
  summary: ReportSummary;
};

const heroContent: Record<
  ReportView,
  { title: string; description: string }
> = {
  submit: {
    title: "Submit reports with a form or paste raw JSON.",
    description:
      "Use the submission workspace to add new runs, validate the payload, and keep the report data updated.",
  },
  dashboard: {
    title: "Track submitted reports from the dashboard.",
    description:
      "Review the current report inventory, monitor totals, and scan the latest run details in one place.",
  },
};

export function ReportHero({ activeView, summary }: ReportHeroProps) {
  const content = heroContent[activeView];

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-slate-950/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl space-y-3">
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
            Run Report System
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            {content.title}
          </h1>
          <p className="text-base leading-7 text-slate-300">
            {content.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Reports</p>
            <p className="mt-2 text-3xl font-semibold">{summary.reportCount}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Estimated Hours</p>
            <p className="mt-2 text-3xl font-semibold">{summary.totalEstimated}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="text-sm text-slate-400">Tokens</p>
            <p className="mt-2 text-3xl font-semibold">{summary.totalTokens}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
