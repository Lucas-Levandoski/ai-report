import JSON5 from "json5";

import { isReportModel, isReportUser } from "@/models/report";
import type { ReportSummary, RunFormState, RunReport } from "@/models/report";

function toNumber(value: string, label: string) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error(`${label} must be a valid number.`);
  }

  return parsed;
}

export function formatReports(reports: RunReport[]) {
  return JSON.stringify(reports, null, 2);
}

export function normalizeReport(input: unknown): RunReport {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("Each report must be an object.");
  }

  const report = input as Record<string, unknown>;
  const {
    user,
    taskId,
    taskName,
    personalDescription,
    complexity,
    estimatedTime,
    realTime,
    tokenUsage,
    models,
    iterations,
    codeQuality,
    codeQualityDescription,
  } = report;

  if (typeof user !== "string" || !isReportUser(user)) {
    throw new Error("user must be one of the available report users.");
  }

  if (typeof taskId !== "string" || !taskId.trim()) {
    throw new Error("taskId is required.");
  }

  if (typeof taskName !== "string" || !taskName.trim()) {
    throw new Error("taskName is required.");
  }

  if (
    typeof personalDescription !== "string" ||
    !personalDescription.trim()
  ) {
    throw new Error("personalDescription is required.");
  }

  if (
    complexity !== "Low" &&
    complexity !== "Medium" &&
    complexity !== "High"
  ) {
    throw new Error("complexity must be Low, Medium, or High.");
  }

  if (
    typeof estimatedTime !== "number" ||
    typeof realTime !== "number" ||
    typeof tokenUsage !== "number" ||
    typeof iterations !== "number" ||
    typeof codeQuality !== "number"
  ) {
    throw new Error("Numeric fields must contain numbers.");
  }

  if (!Array.isArray(models) || models.some((model) => typeof model !== "string")) {
    throw new Error("models must be an array of strings.");
  }

  const normalizedModels = models
    .map((model) => model.trim())
    .filter(Boolean);

  if (
    normalizedModels.length === 0 ||
    normalizedModels.some((model) => !isReportModel(model))
  ) {
    throw new Error("models must contain only available LLM options.");
  }

  if (
    typeof codeQualityDescription !== "string" ||
    !codeQualityDescription.trim()
  ) {
    throw new Error("codeQualityDescription is required.");
  }

  return {
    user,
    taskId: taskId.trim(),
    taskName: taskName.trim(),
    personalDescription: personalDescription.trim(),
    complexity,
    estimatedTime,
    realTime,
    tokenUsage,
    models: normalizedModels,
    iterations,
    codeQuality,
    codeQualityDescription: codeQualityDescription.trim(),
  };
}

export function buildReportFromForm(form: RunFormState): RunReport {
  if (form.models.length === 0) {
    throw new Error("Add at least one model.");
  }

  return normalizeReport({
    user: form.user,
    taskId: form.taskId,
    taskName: form.taskName,
    personalDescription: form.personalDescription,
    complexity: form.complexity,
    estimatedTime: toNumber(form.estimatedTime, "Estimated time"),
    realTime: toNumber(form.realTime, "Real time"),
    tokenUsage: toNumber(form.tokenUsage, "Token usage"),
    models: form.models,
    iterations: toNumber(form.iterations, "Iterations"),
    codeQuality: toNumber(form.codeQuality, "Code quality"),
    codeQualityDescription: form.codeQualityDescription,
  });
}

export function parseReportsInput(input: string) {
  const parsed = JSON5.parse(input) as unknown;

  if (!Array.isArray(parsed)) {
    throw new Error("The JSON input must be an array of reports.");
  }

  return parsed.map(normalizeReport);
}

export function getReportSummary(reports: RunReport[]): ReportSummary {
  return {
    reportCount: reports.length,
    totalEstimated: reports.reduce(
      (total, report) => total + report.estimatedTime,
      0,
    ),
    totalReal: reports.reduce((total, report) => total + report.realTime, 0),
    totalTokens: reports.reduce(
      (total, report) => total + report.tokenUsage,
      0,
    ),
  };
}
