"use client";

type ReportView = "submit" | "dashboard";

type ReportNavbarProps = {
  activeView: ReportView;
  onViewChange: (view: ReportView) => void;
};

const navItems: Array<{ label: string; value: ReportView }> = [
  { label: "Submit Report", value: "submit" },
  { label: "Dashboard", value: "dashboard" },
];

export function ReportNavbar({
  activeView,
  onViewChange,
}: ReportNavbarProps) {
  return (
    <nav className="rounded-3xl border border-white/10 bg-slate-900/80 p-3 shadow-2xl shadow-slate-950/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.24em] text-cyan-300">
            Run Report System
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Switch between report submission and the reporting dashboard.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 rounded-full bg-slate-950/80 p-1">
          {navItems.map((item) => {
            const isActive = item.value === activeView;

            return (
              <button
                key={item.value}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-cyan-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => onViewChange(item.value)}
                type="button"
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
