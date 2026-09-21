import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, technicianNotes } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required." },
        { status: 400 }
      );
    }

    await dataStore.updateVisitStatus(id, status, technicianNotes);

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
