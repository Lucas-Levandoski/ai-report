import type { RunReport } from "@/models/report";

import { normalizeReport } from "./report-utils";
import { createServerSupabaseClient } from "./supabase/server";

type ReportRow = {
  id: number;
  report_user: string;
  task_id: string;
  task_name: string;
  personal_description: string;
  complexity: string;
  estimated_time: number;
  real_time: number;
  token_usage: number;
  models: string[];
  iterations: number;
  code_quality: number;
  code_quality_description: string;
  created_at: string;
};

function mapRowToReport(row: ReportRow): RunReport {
  return normalizeReport({
    id: row.id,
    user: row.report_user,
    taskId: row.task_id,
    taskName: row.task_name,
    personalDescription: row.personal_description,
    complexity: row.complexity,
    estimatedTime: Number(row.estimated_time),
    realTime: Number(row.real_time),
    tokenUsage: Number(row.token_usage),
    models: row.models,
    iterations: Number(row.iterations),
    codeQuality: Number(row.code_quality),
    codeQualityDescription: row.code_quality_description,
  });
}

function mapReportToRow(report: RunReport) {
  return {
    code_quality: report.codeQuality,
    code_quality_description: report.codeQualityDescription,
    complexity: report.complexity,
    estimated_time: report.estimatedTime,
    iterations: report.iterations,
    models: report.models,
    personal_description: report.personalDescription,
    real_time: report.realTime,
    report_user: report.user,
    task_id: report.taskId,
    task_name: report.taskName,
    token_usage: report.tokenUsage,
  };
}

export async function listReports() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(`Could not load reports: ${error.message}`);
  }

  return (data as ReportRow[]).map(mapRowToReport);
}

export async function createReport(report: RunReport) {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("reports")
    .insert(mapReportToRow(report))
    .select("*")
    .single();

  if (error) {
    throw new Error(`Could not save report: ${error.message}`);
  }

  return mapRowToReport(data as ReportRow);
}

export async function replaceReports(reports: RunReport[]) {
  const supabase = createServerSupabaseClient();
  const { error: deleteError } = await supabase
    .from("reports")
    .delete()
    .gte("id", 0);

  if (deleteError) {
    throw new Error(`Could not clear reports: ${deleteError.message}`);
  }

  if (reports.length === 0) {
    return [];
  }

  const { error: insertError } = await supabase
    .from("reports")
    .insert(reports.map(mapReportToRow));

  if (insertError) {
    throw new Error(`Could not replace reports: ${insertError.message}`);
  }

  return listReports();
}

export async function deleteReport(reportId: number) {
  const supabase = createServerSupabaseClient();
  const { error } = await supabase
    .from("reports")
    .delete()
    .eq("id", reportId);

  if (error) {
    throw new Error(`Could not delete report: ${error.message}`);
  }
}
