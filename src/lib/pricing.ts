export type VenueType = "restaurant" | "cafe" | "fast_food" | "food_truck";
export type ServiceFrequency = "weekly" | "biweekly" | "monthly" | "one_time";

export interface AddonOption {
  id: string;
  name: string;
  description: string;
  price: number;
  perFryer?: boolean;
}

export const VENUE_TYPES: { id: VenueType; name: string; description: string; multiplier: number }[] = [
  {
    id: "restaurant",
    name: "Standard Restaurant / Bistro",
    description: "Full-service dinner/lunch service kitchen",
    multiplier: 1.0,
  },
  {
    id: "cafe",
    name: "Cafe / Small Eatery",
    description: "Moderate light-frying volume",
    multiplier: 0.95,
  },
  {
    id: "fast_food",
    name: "Fast Food / High Volume",
    description: "Continuous heavy frying & heavy crumb loads",
    multiplier: 1.15,
  },
  {
    id: "food_truck",
    name: "Food Truck / Mobile Kitchen",
    description: "Compact mobile commercial setup",
    multiplier: 0.9,
  },
];

export const SERVICE_FREQUENCIES: {
  id: ServiceFrequency;
  name: string;
  badge?: string;
  isSubscription: boolean;
  basePrice: number;
  perFryerPrice: number;
  description: string;
}[] = [
  {
    id: "weekly",
    name: "Weekly Scheduled",
    badge: "RECOMMENDED (20% OFF)",
    isSubscription: true,
    basePrice: 45,
    perFryerPrice: 18,
    description: "Optimal oil clarity & maximum oil lifespan",
  },
  {
    id: "biweekly",
    name: "Bi-Weekly Scheduled",
    badge: "POPULAR (15% OFF)",
    isSubscription: true,
    basePrice: 55,
    perFryerPrice: 22,
    description: "Every 2 weeks service cadence",
  },
  {
    id: "monthly",
    name: "Monthly Route",
    badge: "10% OFF",
    isSubscription: true,
    basePrice: 65,
    perFryerPrice: 26,
    description: "Every 4 weeks preventative route visit",
  },
  {
    id: "one_time",
    name: "One-Time Emergency / Deep Clean",
    isSubscription: false,
    basePrice: 85,
    perFryerPrice: 28,
    description: "Single visit on-demand deep service & recovery",
  },
];

export const AVAILABLE_ADDONS: AddonOption[] = [
  {
    id: "deep_boil_out",
    name: "Heavy Vat Boil-Out & Element Strip",
    description: "Thermal chemical boil-out to strip stubborn baked-on carbon",
    price: 45,
    perFryer: true,
  },
  {
    id: "emergency_speed",
    name: "Priority Emergency Dispatch",
    description: "Guaranteed arrival within 3-hour window",
    price: 60,
    perFryer: false,
  },
  {
    id: "fresh_oil_box",
    name: "Fresh High-Oleic Oil Restock (15L Box)",
    description: "Delivered & poured straight into fresh vats",
    price: 38,
    perFryer: true,
  },
  {
    id: "grease_trap_audit",
    name: "Grease Trap Compliance Audit",
    description: "Full visual inspection & compliance report",
    price: 25,
    perFryer: false,
  },
];

export interface CalculationInput {
  venueType?: VenueType | string;
  fryerCount: number;
  frequency?: ServiceFrequency | string;
  selectedAddonIds: string[];
}

export interface CalculationResult {
  isValid: boolean;
  errorMessage?: string;
  basePrice: number;
  fryerSubtotal: number;
  addonsSubtotal: number;
  appliedDiscountPercentage: number;
  totalEstimatedPrice: number;
  estimatedDurationMinutes: number;
  isSubscription: boolean;
  selectedAddonsDetail: { id: string; name: string; price: number }[];
}

export function calculateQuotePrice(input: CalculationInput): CalculationResult {
  const { venueType, fryerCount, frequency, selectedAddonIds } = input;

  // Explicit edge-case validation: no silent $0
  if (!frequency || frequency.trim() === "") {
    return {
      isValid: false,
      errorMessage: "Please select a service frequency option (Weekly, Bi-Weekly, Monthly, or One-Time).",
      basePrice: 0,
      fryerSubtotal: 0,
      addonsSubtotal: 0,
      appliedDiscountPercentage: 0,
      totalEstimatedPrice: 0,
      estimatedDurationMinutes: 0,
      isSubscription: false,
      selectedAddonsDetail: [],
    };
  }

  const freqConfig = SERVICE_FREQUENCIES.find((f) => f.id === frequency);
  if (!freqConfig) {
    return {
      isValid: false,
      errorMessage: `Invalid frequency option: ${frequency}. Please select a recognized plan.`,
      basePrice: 0,
      fryerSubtotal: 0,
      addonsSubtotal: 0,
      appliedDiscountPercentage: 0,
      totalEstimatedPrice: 0,
      estimatedDurationMinutes: 0,
      isSubscription: false,
      selectedAddonsDetail: [],
    };
  }

  const safeFryerCount = Math.max(1, Math.min(20, Math.floor(Number(fryerCount) || 1)));
  const venueConfig = VENUE_TYPES.find((v) => v.id === venueType) || VENUE_TYPES[0];

  const basePrice = freqConfig.basePrice;
  const fryerSubtotal = safeFryerCount * freqConfig.perFryerPrice * venueConfig.multiplier;

  let addonsSubtotal = 0;
  const selectedAddonsDetail: { id: string; name: string; price: number }[] = [];

  for (const addonId of selectedAddonIds) {
    const addon = AVAILABLE_ADDONS.find((a) => a.id === addonId);
    if (addon) {
      const addonPrice = addon.perFryer ? addon.price * safeFryerCount : addon.price;
      addonsSubtotal += addonPrice;
      selectedAddonsDetail.push({
        id: addon.id,
        name: addon.name,
        price: addonPrice,
      });
    }
  }

  const totalEstimatedPrice = Number((basePrice + fryerSubtotal + addonsSubtotal).toFixed(2));
  const estimatedDurationMinutes = 30 + safeFryerCount * 15 + (selectedAddonIds.includes("deep_boil_out") ? 30 : 0);

  const discountMap: Record<ServiceFrequency, number> = {
    weekly: 20,
    biweekly: 15,
    monthly: 10,
    one_time: 0,
  };

  return {
    isValid: true,
    basePrice,
    fryerSubtotal: Number(fryerSubtotal.toFixed(2)),
    addonsSubtotal: Number(addonsSubtotal.toFixed(2)),
    appliedDiscountPercentage: discountMap[freqConfig.id],
    totalEstimatedPrice,
    estimatedDurationMinutes,
    isSubscription: freqConfig.isSubscription,
    selectedAddonsDetail,
  };
}
