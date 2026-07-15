import { NextResponse } from "next/server";

import {
  createReport,
  listReports,
  replaceReports,
} from "@/lib/report-storage";
import { normalizeReport } from "@/lib/report-utils";

export async function GET() {
  try {
    const reports = await listReports();

    return NextResponse.json(reports);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load reports.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;
    const report = normalizeReport(payload);
    const savedReport = await createReport(report);

    return NextResponse.json(savedReport, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not save report.",
      },
      { status: 400 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as unknown;

    if (!Array.isArray(payload)) {
      throw new Error("The request body must be an array of reports.");
    }

    const reports = payload.map(normalizeReport);
    const savedReports = await replaceReports(reports);

    return NextResponse.json(savedReports);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not replace reports.",
      },
      { status: 400 },
    );
  }
}
