import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { getOperatorSession } from "@/lib/auth";

const ALLOWED_VISIT_STATUSES = [
  "scheduled",
  "en_route",
  "in_progress",
  "completed",
  "cancelled",
] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAuthed = await getOperatorSession();
  if (!isAuthed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Operator session required." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const { status, technicianNotes } = body;

    if (!status || !ALLOWED_VISIT_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${ALLOWED_VISIT_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const sanitizedNotes = typeof technicianNotes === "string" ? technicianNotes.slice(0, 1000) : undefined;
    await dataStore.updateVisitStatus(id, status, sanitizedNotes);

    return NextResponse.json({
      success: true,
      message: `Visit ${id} status updated to ${status}.`,
    });
  } catch (error) {
    console.error("Error updating visit status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update visit status." },
      { status: 500 }
    );
  }
}
