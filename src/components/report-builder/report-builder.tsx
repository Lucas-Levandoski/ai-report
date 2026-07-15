"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { initialFormState } from "@/data/report-defaults";
import {
  buildReportFromForm,
  formatReports,
  getReportSummary,
  normalizeReport,
  parseReportsInput,
} from "@/lib/report-utils";
import type { Project, RunFormState, RunReport } from "@/models/report";

import { JsonEditor } from "./json-editor";
import { ReportForm } from "./report-form";
import { ReportHero } from "./report-hero";
import { ReportList } from "./report-list";
import { ReportNavbar } from "./report-navbar";

type ReportView = "submit" | "dashboard";

export default function ReportBuilder() {
  const [reports, setReports] = useState<RunReport[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<RunFormState>(initialFormState);
  const [jsonInput, setJsonInput] = useState(formatReports([]));
  const [activeView, setActiveView] = useState<ReportView>("submit");
  const [deletingReportId, setDeletingReportId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState("Loading reports from Supabase.");
  const [error, setError] = useState("");
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);

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

  const loadProjects = useCallback(async () => {
    setIsLoadingProjects(true);

    try {
      const response = await fetch("/api/projects", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load projects from Supabase.");
      }

      const payload = (await response.json()) as unknown;

      if (!Array.isArray(payload)) {
        throw new Error("Supabase returned an invalid project payload.");
      }

      const nextProjects = payload as Project[];
      setProjects(nextProjects);

      setForm((current) => {
        const hasSelected = nextProjects.some(
          (project) => project.name === current.projectName,
        );

        if (!hasSelected && nextProjects.length > 0) {
          return {
            ...current,
            projectName: nextProjects[0].name,
          };
        }

        return current;
      });
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load projects.",
      );
    } finally {
      setIsLoadingProjects(false);
    }
  }, []);

  const loadReports = useCallback(async () => {
    setIsLoadingReports(true);

    try {
      const response = await fetch("/api/reports", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Could not load reports from Supabase.");
      }

      const payload = (await response.json()) as unknown;

      if (!Array.isArray(payload)) {
        throw new Error("Supabase returned an invalid report payload.");
      }

      const nextReports = payload.map(normalizeReport);

      syncReports(
        nextReports,
        nextReports.length === 0
          ? "Connected to Supabase. No reports have been saved yet."
          : `Loaded ${nextReports.length} report entries from Supabase.`,
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Could not load reports.",
      );
    } finally {
      setIsLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
    void loadReports();
  }, [loadProjects, loadReports]);

  async function handleCreateProject(name: string) {
    const response = await fetch("/api/projects", {
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      const payload = (await response.json()) as { error?: string };

      throw new Error(payload.error ?? "Could not create project.");
    }

    const project = (await response.json()) as Project;
    setProjects((current) => [...current, project]);
    setFeedback(`Created "${project.name}" project.`);
    setError("");

    return project;
  }

  async function handleAddReport() {
    try {
      const nextReport = buildReportFromForm(form);
      const response = await fetch("/api/reports", {
        body: JSON.stringify(nextReport),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };

        throw new Error(payload.error ?? "Could not save report.");
      }

      const savedReport = normalizeReport((await response.json()) as unknown);

      syncReports(
        [...reports, savedReport],
        `Added "${savedReport.taskName}" to Supabase.`,
      );
      setForm(initialFormState);
    } catch (formError) {
      setError(
        formError instanceof Error ? formError.message : "Could not add report.",
      );
    }
  }

  async function handleApplyJson() {
    try {
      const nextReports = parseReportsInput(jsonInput);
      const response = await fetch("/api/reports", {
        body: JSON.stringify(nextReports),
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };

        throw new Error(payload.error ?? "Could not replace reports.");
      }

      const savedPayload = (await response.json()) as unknown;

      if (!Array.isArray(savedPayload)) {
        throw new Error("Supabase returned an invalid report payload.");
      }

      const savedReports = savedPayload.map(normalizeReport);

      syncReports(
        savedReports,
        `Saved ${savedReports.length} report entries to Supabase.`,
      );
    } catch (parseError) {
      setError(
        parseError instanceof Error
          ? parseError.message
          : "Could not parse the JSON input.",
      );
    }
  }

  async function handleDeleteReport(report: RunReport) {
    if (!report.id) {
      setError("This report cannot be deleted because it has no database id.");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete "${report.taskName}" from Supabase?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingReportId(report.id);

    try {
      const response = await fetch(`/api/reports/${report.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };

        throw new Error(payload.error ?? "Could not delete report.");
      }

      syncReports(
        reports.filter((currentReport) => currentReport.id !== report.id),
        `Deleted "${report.taskName}" from Supabase.`,
      );
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Could not delete report.",
      );
    } finally {
      setDeletingReportId(null);
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

  const statusMessage = isLoadingReports
    ? "Loading reports from Supabase."
    : isLoadingProjects
      ? "Loading projects from Supabase."
    : error || feedback;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-50">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <ReportNavbar activeView={activeView} onViewChange={setActiveView} />
        <ReportHero activeView={activeView} summary={summary} />

        {activeView === "submit" ? (
          <section className="grid gap-8 xl:grid-cols-[1.2fr_1fr]">
            <ReportForm
              form={form}
              projects={projects}
              onFieldChange={updateForm}
              onAddReport={handleAddReport}
              onClearForm={handleClearForm}
              onCreateProject={handleCreateProject}
            />

            <JsonEditor
              jsonInput={jsonInput}
              statusMessage={statusMessage}
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

            <ReportList
              deletingReportId={deletingReportId}
              onDeleteReport={handleDeleteReport}
              reports={reports}
              summary={summary}
            />
          </section>
        )}
      </div>
    </main>
  );
}
