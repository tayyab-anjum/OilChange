import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { getOperatorSession } from "@/lib/auth";

const ALLOWED_INQUIRY_STATUSES = ["new", "contacted", "quoted", "closed"] as const;

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
    const { status } = body;

    if (!status || !ALLOWED_INQUIRY_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${ALLOWED_INQUIRY_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    await dataStore.updateInquiryStatus(id, status);

    return NextResponse.json({
      success: true,
      message: `Inquiry ${id} status updated to ${status}.`,
    });
  } catch (error) {
    console.error("Error updating inquiry status:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry status." },
      { status: 500 }
    );
  }
}
