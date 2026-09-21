import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";
import { getOperatorSession } from "@/lib/auth";

export async function GET() {
  const isAuthed = await getOperatorSession();
  if (!isAuthed) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Operator session required." },
      { status: 401 }
    );
  }

  try {
    const [visits, inquiries, subscriptions] = await Promise.all([
      dataStore.getAllVisits(),
      dataStore.getAllInquiries(),
      dataStore.getAllSubscriptions(),
    ]);

    return NextResponse.json({
      success: true,
      visits,
      inquiries,
      subscriptions,
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load dashboard data." },
      { status: 500 }
    );
  }
}
