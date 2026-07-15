import { reportModels, reportUsers } from "@/models/report";
import type { Complexity, RunFormState } from "@/models/report";

type ReportFormProps = {
  form: RunFormState;
  onFieldChange: <K extends keyof RunFormState>(
    key: K,
    value: RunFormState[K],
  ) => void;
  onAddReport: () => void;
  onClearForm: () => void;
};

export function ReportForm({
  form,
  onFieldChange,
  onAddReport,
  onClearForm,
}: ReportFormProps) {
  function handleModelToggle(model: RunFormState["models"][number]) {
    const nextModels = form.models.includes(model)
      ? form.models.filter((currentModel) => currentModel !== model)
      : [...form.models, model];

    onFieldChange("models", nextModels);
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-slate-950/20">
      <div className="mb-6 space-y-2">
        <h2 className="text-2xl font-semibold">Add run details</h2>
        <p className="text-sm leading-6 text-slate-600">
          Fill in the report fields and append a new item to the current JSON.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">User</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.user}
            onChange={(event) =>
              onFieldChange("user", event.target.value as RunFormState["user"])
            }
          >
            <option value="">Select a user</option>
            {reportUsers.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Task ID</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.taskId}
            onChange={(event) => onFieldChange("taskId", event.target.value)}
            placeholder="123123"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Task name</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.taskName}
            onChange={(event) => onFieldChange("taskName", event.target.value)}
            placeholder="Data Processing"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Personal description
          </span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.personalDescription}
            onChange={(event) =>
              onFieldChange("personalDescription", event.target.value)
            }
            placeholder="Describe the run and its objective."
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Complexity</span>
          <select
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.complexity}
            onChange={(event) =>
              onFieldChange("complexity", event.target.value as Complexity)
            }
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <div className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Models used</span>
          <div className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
            {reportModels.map((model) => {
              const isSelected = form.models.includes(model);

              return (
                <label
                  key={model}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm transition ${
                    isSelected
                      ? "border-cyan-500 bg-white text-slate-950"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <input
                    checked={isSelected}
                    className="h-4 w-4 accent-cyan-600"
                    onChange={() => handleModelToggle(model)}
                    type="checkbox"
                  />
                  <span>{model}</span>
                </label>
              );
            })}
          </div>
          <p className="text-xs text-slate-500">
            Select one or more LLM models for this report.
          </p>
        </div>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">
            Estimated time
          </span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.estimatedTime}
            onChange={(event) =>
              onFieldChange("estimatedTime", event.target.value)
            }
            placeholder="5"
            type="number"
            min="0"
            step="0.1"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Real time</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.realTime}
            onChange={(event) => onFieldChange("realTime", event.target.value)}
            placeholder="2"
            type="number"
            min="0"
            step="0.1"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Token usage</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.tokenUsage}
            onChange={(event) => onFieldChange("tokenUsage", event.target.value)}
            placeholder="15"
            type="number"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Iterations</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.iterations}
            onChange={(event) => onFieldChange("iterations", event.target.value)}
            placeholder="3"
            type="number"
            min="0"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Code quality</span>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.codeQuality}
            onChange={(event) => onFieldChange("codeQuality", event.target.value)}
            placeholder="5"
            type="number"
            min="0"
            max="5"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-slate-700">
            Code quality description
          </span>
          <textarea
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:bg-white"
            value={form.codeQualityDescription}
            onChange={(event) =>
              onFieldChange("codeQualityDescription", event.target.value)
            }
            placeholder="Describe code quality and maintainability."
          />
        </label>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          type="button"
          onClick={onAddReport}
        >
          Add report
        </button>
        <button
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          type="button"
          onClick={onClearForm}
        >
          Clear form
        </button>
      </div>
    </div>
  );
}
