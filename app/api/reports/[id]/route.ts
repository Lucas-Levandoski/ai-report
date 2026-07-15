import { NextResponse } from "next/server";

import { deleteReport } from "@/lib/report-storage";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const reportId = Number(id);

    if (!Number.isInteger(reportId) || reportId <= 0) {
      throw new Error("Report id must be a positive integer.");
    }

    await deleteReport(reportId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not delete report.",
      },
      { status: 400 },
    );
  }
}
