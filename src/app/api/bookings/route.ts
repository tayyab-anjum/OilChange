import { NextRequest, NextResponse } from "next/server";
import { bookingSchema } from "@/lib/validations/booking";
import { calculateQuotePrice } from "@/lib/pricing";
import { dataStore } from "@/lib/data-store";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.json();

    // 1. Strict Zod Schema Validation
    const parseResult = bookingSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {};
      parseResult.error.errors.forEach((err) => {
        const fieldName = err.path.join(".");
        fieldErrors[fieldName] = err.message;
      });

      return NextResponse.json(
        {
          success: false,
          error: "Validation failed. Please check your inputs.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 2. Server-side quote calculation & edge-case validation
    const calculation = calculateQuotePrice({
      venueType: data.venueType,
      fryerCount: data.fryerCount,
      frequency: data.frequency,
      selectedAddonIds: data.selectedAddonIds,
    });

    if (!calculation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: calculation.errorMessage || "Calculation failed.",
        },
        { status: 400 }
      );
    }

    // 3. Persist to PostgreSQL via Parameterized Queries
    const bookingResult = await dataStore.createBooking({
      businessName: data.businessName,
      contactName: data.contactName,
      email: data.email,
      phone: data.phone,
      address: data.address,
      venueType: data.venueType,
      fryerCount: data.fryerCount,
      frequency: data.frequency,
      isSubscription: calculation.isSubscription,
      estimatedPrice: calculation.totalEstimatedPrice,
      selectedAddons: calculation.selectedAddonsDetail,
      preferredDay: data.preferredDay || "monday",
      preferredTimeWindow: data.preferredTimeWindow || "morning_pre_open",
      specialInstructions: data.specialInstructions,
    });

    // 4. Return success response with generated tracking code
    return NextResponse.json(
      {
        success: true,
        referenceCode: bookingResult.referenceCode,
        estimatedPrice: calculation.totalEstimatedPrice,
        isSubscription: calculation.isSubscription,
        estimatedDurationMinutes: calculation.estimatedDurationMinutes,
        message: `Booking received successfully! Your route confirmation code is ${bookingResult.referenceCode}. Our technician will confirm your window shortly.`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while processing your booking. Please call dispatch directly.",
      },
      { status: 500 }
    );
  }
}
