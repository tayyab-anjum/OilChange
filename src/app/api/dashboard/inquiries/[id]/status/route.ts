import { NextRequest, NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { success: false, error: "Status is required." },
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
