type JsonEditorProps = {
  jsonInput: string;
  statusMessage: string;
  onJsonChange: (value: string) => void;
  onFormatJson: () => void;
  onLoadJson: () => void;
};

export function JsonEditor({
  jsonInput,
  statusMessage,
  onJsonChange,
  onFormatJson,
  onLoadJson,
}: JsonEditorProps) {
  return (
    <div className="flex flex-col gap-8">
      <section className="rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl shadow-slate-950/20">
        <div className="mb-4 space-y-2">
          <h2 className="text-2xl font-semibold text-white">Push raw JSON</h2>
          <p className="text-sm leading-6 text-slate-300">
            Paste a JSON array, then format it or load it into the report list.
          </p>
        </div>

        <textarea
          className="min-h-96 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-4 font-mono text-sm leading-6 text-slate-100 outline-none transition focus:border-cyan-400"
          value={jsonInput}
          onChange={(event) => onJsonChange(event.target.value)}
          spellCheck={false}
        />

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            type="button"
            onClick={onFormatJson}
          >
            Format JSON
          </button>
          <button
            className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            type="button"
            onClick={onLoadJson}
          >
            Load JSON
          </button>
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold text-white">Status</h2>
        <p className="mt-3 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm leading-6 text-slate-200">
          {statusMessage}
        </p>
      </section>
    </div>
  );
}
