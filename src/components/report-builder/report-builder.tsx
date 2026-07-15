"use client";

import { useMemo, useState } from "react";

import { exampleReports, initialFormState } from "@/data/report-defaults";
import {
  buildReportFromForm,
  formatReports,
  getReportSummary,
  parseReportsInput,
} from "@/lib/report-utils";
import type { RunFormState, RunReport } from "@/models/report";

import { JsonEditor } from "./json-editor";
import { ReportForm } from "./report-form";
import { ReportHero } from "./report-hero";
import { ReportList } from "./report-list";
import { ReportNavbar } from "./report-navbar";

type ReportView = "submit" | "dashboard";

export default function ReportBuilder() {
  const [reports, setReports] = useState<RunReport[]>(exampleReports);
  const [form, setForm] = useState<RunFormState>(initialFormState);
  const [jsonInput, setJsonInput] = useState(formatReports(exampleReports));
  const [activeView, setActiveView] = useState<ReportView>("submit");
  const [feedback, setFeedback] = useState(
    "You can add a run from the form or paste JSON into the textarea.",
  );
  const [error, setError] = useState("");

  const summary = useMemo(() => getReportSummary(reports), [reports]);

  function syncReports(nextReports: RunReport[], message: string) {
    setReports(nextReports);
    setJsonInput(formatReports(nextReports));
    setFeedback(message);
    setError("");
  }

  function updateForm<K extends keyof RunFormState>(
    key: K,
    value: RunFormState[K],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  function handleAddReport() {
    try {
      const nextReport = buildReportFromForm(form);

      syncReports(
        [...reports, nextReport],
        `Added "${nextReport.taskName}" to the report list.`,
      );
      setForm(initialFormState);
    } catch (formError) {
      setError(
        formError instanceof Error ? formError.message : "Could not add report.",
      );
    }
  }

  function handleApplyJson() {
    try {
      const nextReports = parseReportsInput(jsonInput);
      syncReports(nextReports, `Loaded ${nextReports.length} report entries from JSON.`);
    } catch (parseError) {
      setError(
        parseError instanceof Error
          ? parseError.message
          : "Could not parse the JSON input.",
      );
    }
  }

  function handleFormatJson() {
    try {
      const nextReports = parseReportsInput(jsonInput);
      setJsonInput(formatReports(nextReports));
      setFeedback("JSON was formatted successfully.");
      setError("");
    } catch (parseError) {
      setError(
        parseError instanceof Error
          ? parseError.message
          : "Could not format the JSON input.",
      );
    }
  }

  function handleClearForm() {
    setForm(initialFormState);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <ReportNavbar activeView={activeView} onViewChange={setActiveView} />
        <ReportHero activeView={activeView} summary={summary} />

        {activeView === "submit" ? (
          <section className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
            <ReportForm
              form={form}
              onFieldChange={updateForm}
              onAddReport={handleAddReport}
              onClearForm={handleClearForm}
            />

            <JsonEditor
              jsonInput={jsonInput}
              statusMessage={error || feedback}
              onJsonChange={setJsonInput}
              onFormatJson={handleFormatJson}
              onLoadJson={handleApplyJson}
            />
          </section>
        ) : (
          <section className="grid gap-8">
            <section className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Reports dashboard
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    Review totals and current report entries without the
                    submission controls.
                  </p>
                </div>
                <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-100">
                  {reports.length} report{reports.length === 1 ? "" : "s"} loaded
                </div>
              </div>
            </section>

            <ReportList reports={reports} summary={summary} />
          </section>
        )}
      </div>
    </main>
  );
}
