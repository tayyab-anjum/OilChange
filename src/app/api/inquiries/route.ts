import { NextRequest, NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validations/inquiry";
import { dataStore } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // 1. Strict Zod Schema Validation
    const parseResult = inquirySchema.safeParse(rawBody);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        const fieldName = err.path.join(".");
        fieldErrors[fieldName] = err.message;
      });

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please verify the required contact fields.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 2. Persist to PostgreSQL via Parameterized Query
    const result = await dataStore.createInquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      businessName: data.businessName,
      subject: data.subject,
      message: data.message,
    });

    return NextResponse.json(
      {
        success: true,
        referenceCode: result.referenceCode,
        message: `Your inquiry (${result.referenceCode}) has been received. Our route operator will get back to you within 2 business hours.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Unable to submit inquiry due to a temporary server error. Please call our direct line at (800) 379-3722.",
      },
      { status: 500 }
    );
  }
}
