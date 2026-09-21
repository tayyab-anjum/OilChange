import { db, schema } from "@/db";
import { venues, subscriptions, serviceVisits, inquiries } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// In-memory / file fallback store for local development when PostgreSQL instance is running headless
interface LocalMemoryStore {
  venues: Array<typeof venues.$inferSelect>;
  subscriptions: Array<typeof subscriptions.$inferSelect>;
  serviceVisits: Array<typeof serviceVisits.$inferSelect>;
  inquiries: Array<typeof inquiries.$inferSelect>;
}

const globalStore = globalThis as unknown as {
  __fryerCareStore?: LocalMemoryStore;
};

if (!globalStore.__fryerCareStore) {
  globalStore.__fryerCareStore = {
    venues: [
      {
        id: "v-001",
        businessName: "The Rusty Anchor Bistro",
        contactName: "Marcus Vance",
        email: "marcus@rustyanchor.com",
        phone: "(555) 234-8901",
        address: "412 Harbor Boulevard, Suite 104",
        venueType: "restaurant",
        fryerCount: 3,
        createdAt: new Date(Date.now() - 86400000 * 3),
        updatedAt: new Date(),
      },
      {
        id: "v-002",
        businessName: "Crispy Bird Nashville Hot Chicken",
        contactName: "Elena Rostova",
        email: "elena@crispybird.com",
        phone: "(555) 890-1234",
        address: "782 Main Street Commercial Strip",
        venueType: "fast_food",
        fryerCount: 6,
        createdAt: new Date(Date.now() - 86400000 * 7),
        updatedAt: new Date(),
      },
    ],
    subscriptions: [
      {
        id: "sub-001",
        venueId: "v-001",
        frequency: "weekly",
        status: "active",
        baseRate: "99.00",
        selectedAddons: ["deep_boil_out"],
        preferredDay: "tuesday",
        preferredTimeWindow: "morning_pre_open",
        startDate: new Date(Date.now() - 86400000 * 20),
        nextServiceDate: new Date(Date.now() + 86400000 * 2),
        createdAt: new Date(Date.now() - 86400000 * 20),
      },
    ],
    serviceVisits: [
      {
        id: "vis-001",
        referenceCode: "FC-892104",
        venueId: "v-001",
        subscriptionId: "sub-001",
        serviceType: "subscription",
        frequency: "weekly",
        status: "scheduled",
        scheduledAt: new Date(Date.now() + 86400000 * 1),
        preferredDay: "tuesday",
        preferredTimeWindow: "07:00 AM - 09:00 AM",
        estimatedPrice: "99.00",
        fryerCount: 3,
        addons: [{ id: "deep_boil_out", name: "Heavy Vat Boil-Out", price: 135 }],
        technicianNotes: "Access through rear alley double metal doors. Grease trap key on pegboard.",
        completedAt: null,
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        id: "vis-002",
        referenceCode: "FC-771209",
        venueId: "v-002",
        subscriptionId: null,
        serviceType: "one_time",
        frequency: "one_time",
        status: "completed",
        scheduledAt: new Date(Date.now() - 86400000 * 2),
        preferredDay: "friday",
        preferredTimeWindow: "06:00 AM - 08:00 AM",
        estimatedPrice: "253.00",
        fryerCount: 6,
        addons: [{ id: "emergency_speed", name: "Priority Emergency Dispatch", price: 60 }],
        technicianNotes: "Completed deep flush & oil restock. 120L waste cooking oil removed.",
        completedAt: new Date(Date.now() - 86400000 * 2),
        createdAt: new Date(Date.now() - 86400000 * 3),
      },
    ],
    inquiries: [
      {
        id: "inq-001",
        referenceCode: "INQ-459012",
        venueId: null,
        name: "David Chen",
        email: "david@wokstarbbq.com",
        phone: "(555) 765-4321",
        businessName: "Wok Star BBQ & Grill",
        subject: "Multi-location Route Pricing Quote",
        message: "We have 3 locations across the metro corridor. Looking for a combined bi-weekly schedule for 12 total fryers. Please call me tomorrow morning.",
        status: "new",
        createdAt: new Date(Date.now() - 86400000 * 1),
      },
    ],
  };
}

export const dataStore = {
  async createBooking(payload: {
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    venueType: string;
    fryerCount: number;
    frequency: string;
    isSubscription: boolean;
    estimatedPrice: number;
    selectedAddons: { id: string; name: string; price: number }[];
    preferredDay: string;
    preferredTimeWindow: string;
    specialInstructions?: string;
  }) {
    const referenceCode = `FC-${Math.floor(100000 + Math.random() * 900000)}`;
    const venueId = `v-${Date.now()}`;
    const visitId = `vis-${Date.now()}`;
    const subId = payload.isSubscription ? `sub-${Date.now()}` : null;

    try {
      // Try direct PostgreSQL parameterized write
      const [insertedVenue] = await db
        .insert(venues)
        .values({
          businessName: payload.businessName,
          contactName: payload.contactName,
          email: payload.email,
          phone: payload.phone,
          address: payload.address,
          venueType: payload.venueType,
          fryerCount: payload.fryerCount,
        })
        .returning();

      let insertedSubId: string | null = null;
      if (payload.isSubscription && insertedVenue) {
        const [insertedSub] = await db
          .insert(subscriptions)
          .values({
            venueId: insertedVenue.id,
            frequency: payload.frequency,
            status: "active",
            baseRate: payload.estimatedPrice.toString(),
            selectedAddons: payload.selectedAddons.map((a) => a.id),
            preferredDay: payload.preferredDay,
            preferredTimeWindow: payload.preferredTimeWindow,
          })
          .returning();
        insertedSubId = insertedSub.id;
      }

      const [insertedVisit] = await db
        .insert(serviceVisits)
        .values({
          referenceCode,
          venueId: insertedVenue?.id || venueId,
          subscriptionId: insertedSubId,
          serviceType: payload.isSubscription ? "subscription" : "one_time",
          frequency: payload.frequency,
          status: "scheduled",
          scheduledAt: new Date(Date.now() + 86400000 * 2),
          preferredDay: payload.preferredDay,
          preferredTimeWindow: payload.preferredTimeWindow,
          estimatedPrice: payload.estimatedPrice.toString(),
          fryerCount: payload.fryerCount,
          addons: payload.selectedAddons,
          technicianNotes: payload.specialInstructions || null,
        })
        .returning();

      return {
        referenceCode: insertedVisit?.referenceCode || referenceCode,
        id: insertedVisit?.id || visitId,
      };
    } catch {
      // Graceful local store fallback
      const store = globalStore.__fryerCareStore!;
      const newVenue = {
        id: venueId,
        businessName: payload.businessName,
        contactName: payload.contactName,
        email: payload.email,
        phone: payload.phone,
        address: payload.address,
        venueType: payload.venueType,
        fryerCount: payload.fryerCount,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      store.venues.unshift(newVenue);

      if (subId) {
        store.subscriptions.unshift({
          id: subId,
          venueId,
          frequency: payload.frequency,
          status: "active",
          baseRate: payload.estimatedPrice.toString(),
          selectedAddons: payload.selectedAddons.map((a) => a.id),
          preferredDay: payload.preferredDay,
          preferredTimeWindow: payload.preferredTimeWindow,
          startDate: new Date(),
          nextServiceDate: new Date(Date.now() + 86400000 * 7),
          createdAt: new Date(),
        });
      }

      const newVisit = {
        id: visitId,
        referenceCode,
        venueId,
        subscriptionId: subId,
        serviceType: payload.isSubscription ? "subscription" : "one_time",
        frequency: payload.frequency,
        status: "scheduled",
        scheduledAt: new Date(Date.now() + 86400000 * 2),
        preferredDay: payload.preferredDay,
        preferredTimeWindow: payload.preferredTimeWindow,
        estimatedPrice: payload.estimatedPrice.toString(),
        fryerCount: payload.fryerCount,
        addons: payload.selectedAddons,
        technicianNotes: payload.specialInstructions || null,
        completedAt: null,
        createdAt: new Date(),
      };
      store.serviceVisits.unshift(newVisit);

      return { referenceCode, id: visitId };
    }
  },

  async createInquiry(payload: {
    name: string;
    email: string;
    phone: string;
    businessName: string;
    subject: string;
    message: string;
  }) {
    const referenceCode = `INQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = `inq-${Date.now()}`;

    try {
      const [inserted] = await db
        .insert(inquiries)
        .values({
          referenceCode,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          businessName: payload.businessName,
          subject: payload.subject,
          message: payload.message,
          status: "new",
        })
        .returning();
      return { referenceCode: inserted?.referenceCode || referenceCode, id: inserted?.id || id };
    } catch {
      const store = globalStore.__fryerCareStore!;
      store.inquiries.unshift({
        id,
        referenceCode,
        venueId: null,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        businessName: payload.businessName,
        subject: payload.subject,
        message: payload.message,
        status: "new",
        createdAt: new Date(),
      });
      return { referenceCode, id };
    }
  },

  async getAllVisits() {
    try {
      const visits = await db.select().from(serviceVisits).orderBy(desc(serviceVisits.createdAt)).limit(100);
      const allVenues = await db.select().from(venues).limit(500);
      const venueMap = new Map(allVenues.map((ven) => [ven.id, ven]));
      return visits.map((v) => ({
        ...v,
        venue: venueMap.get(v.venueId) || null,
      }));
    } catch {
      const store = globalStore.__fryerCareStore!;
      const venueMap = new Map(store.venues.map((ven) => [ven.id, ven]));
      return store.serviceVisits.map((v) => ({
        ...v,
        venue: venueMap.get(v.venueId) || null,
      }));
    }
  },

  async getAllInquiries() {
    try {
      return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(100);
    } catch {
      return globalStore.__fryerCareStore!.inquiries;
    }
  },

  async getAllSubscriptions() {
    try {
      const subs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt)).limit(100);
      const allVenues = await db.select().from(venues).limit(500);
      const venueMap = new Map(allVenues.map((ven) => [ven.id, ven]));
      return subs.map((s) => ({
        ...s,
        venue: venueMap.get(s.venueId) || null,
      }));
    } catch {
      const store = globalStore.__fryerCareStore!;
      const venueMap = new Map(store.venues.map((ven) => [ven.id, ven]));
      return store.subscriptions.map((s) => ({
        ...s,
        venue: venueMap.get(s.venueId) || null,
      }));
    }
  },

  async updateVisitStatus(visitId: string, status: string, notes?: string) {
    const validStatuses = ["scheduled", "en_route", "in_progress", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid visit status: ${status}`);
    }

    try {
      await db
        .update(serviceVisits)
        .set({ status, technicianNotes: notes })
        .where(eq(serviceVisits.id, visitId));
    } catch {
      const store = globalStore.__fryerCareStore!;
      const v = store.serviceVisits.find((vis) => vis.id === visitId);
      if (v) {
        v.status = status;
        if (notes !== undefined) v.technicianNotes = notes;
      }
    }
  },

  async updateInquiryStatus(inquiryId: string, status: string) {
    const validStatuses = ["new", "contacted", "quoted", "closed"];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid inquiry status: ${status}`);
    }

    try {
      await db.update(inquiries).set({ status }).where(eq(inquiries.id, inquiryId));
    } catch {
      const store = globalStore.__fryerCareStore!;
      const inq = store.inquiries.find((i) => i.id === inquiryId);
      if (inq) inq.status = status;
    }
  },
};
