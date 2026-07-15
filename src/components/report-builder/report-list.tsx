import type { ReportSummary, RunReport } from "@/models/report";

type ReportListProps = {
  deletingReportId?: number | null;
  onDeleteReport: (report: RunReport) => void;
  reports: RunReport[];
  summary: ReportSummary;
};

export function ReportList({
  deletingReportId,
  onDeleteReport,
  reports,
  summary,
}: ReportListProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Current reports</h2>
          <p className="text-sm leading-6 text-slate-300">
            Review the entries currently represented in the JSON payload.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          Real time total: {summary.totalReal} hours
        </p>
      </div>

      <div className="grid gap-4">
        {reports.map((report) => (
          <article
            key={report.id ?? report.taskId}
            className="rounded-2xl border border-white/10 bg-slate-950/60 p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">
                    {report.taskName}
                  </h3>
                  <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-200">
                    {report.user}
                  </span>
                  <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
                    {report.complexity}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-400">
                  Task ID: {report.taskId}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  {report.personalDescription}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-300 sm:grid-cols-3">
                <div>
                  <p className="text-slate-500">Estimated</p>
                  <p className="mt-1 font-semibold text-white">
                    {report.estimatedTime}h
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Real</p>
                  <p className="mt-1 font-semibold text-white">
                    {report.realTime}h
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Tokens</p>
                  <p className="mt-1 font-semibold text-white">
                    {report.tokenUsage}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Iterations</p>
                  <p className="mt-1 font-semibold text-white">
                    {report.iterations}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Code quality</p>
                  <p className="mt-1 font-semibold text-white">
                    {report.codeQuality}/5
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                className="rounded-full border border-rose-400/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={!report.id || deletingReportId === report.id}
                onClick={() => onDeleteReport(report)}
                type="button"
              >
                {deletingReportId === report.id ? "Deleting..." : "Delete"}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {report.models.map((model) => (
                <span
                  key={`${report.id ?? report.taskId}-${model}`}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {model}
                </span>
              ))}
            </div>

            <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-slate-300">
              {report.codeQualityDescription}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
