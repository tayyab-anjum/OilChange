import { NextResponse } from "next/server";
import { dataStore } from "@/lib/data-store";

export async function GET() {
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
