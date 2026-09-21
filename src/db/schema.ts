import { pgTable, text, timestamp, integer, numeric, jsonb, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// 1. Venues / Restaurant Customers Table
export const venues = pgTable("venues", {
  id: uuid("id").defaultRandom().primaryKey(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  address: text("address").notNull(),
  venueType: varchar("venue_type", { length: 50 }).notNull().default("restaurant"), // restaurant, cafe, fast_food, food_truck
  fryerCount: integer("fryer_count").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// 2. Subscriptions Table (Recurring route agreements)
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: "cascade" }).notNull(),
  frequency: varchar("frequency", { length: 50 }).notNull(), // weekly, biweekly, monthly
  status: varchar("status", { length: 50 }).notNull().default("active"), // active, paused, cancelled
  baseRate: numeric("base_rate", { precision: 10, scale: 2 }).notNull(),
  selectedAddons: jsonb("selected_addons").$type<string[]>().default([]),
  preferredDay: varchar("preferred_day", { length: 20 }).default("monday"), // monday..sunday
  preferredTimeWindow: varchar("preferred_time_window", { length: 50 }).default("morning_pre_open"),
  startDate: timestamp("start_date", { withTimezone: true }).defaultNow().notNull(),
  nextServiceDate: timestamp("next_service_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 3. Service Visits & Bookings Table
export const serviceVisits = pgTable("service_visits", {
  id: uuid("id").defaultRandom().primaryKey(),
  referenceCode: varchar("reference_code", { length: 50 }).notNull().unique(),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: "cascade" }).notNull(),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id, { onDelete: "set null" }),
  serviceType: varchar("service_type", { length: 50 }).notNull(), // subscription, one_time
  frequency: varchar("frequency", { length: 50 }), // weekly, biweekly, monthly, one_time
  status: varchar("status", { length: 50 }).notNull().default("scheduled"), // scheduled, en_route, in_progress, completed, cancelled
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }),
  preferredDay: varchar("preferred_day", { length: 50 }),
  preferredTimeWindow: varchar("preferred_time_window", { length: 50 }),
  estimatedPrice: numeric("estimated_price", { precision: 10, scale: 2 }).notNull(),
  fryerCount: integer("fryer_count").notNull(),
  addons: jsonb("addons").$type<{ id: string; name: string; price: number }[]>().default([]),
  technicianNotes: text("technician_notes"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 4. Inquiries & Leads Table
export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  referenceCode: varchar("reference_code", { length: 50 }).notNull().unique(),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("new"), // new, contacted, quoted, closed
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// 5. Operator User (Authentication) Table
export const operatorUsers = pgTable("operator_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Relations
export const venuesRelations = relations(venues, ({ many }) => ({
  subscriptions: many(subscriptions),
  serviceVisits: many(serviceVisits),
  inquiries: many(inquiries),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  venue: one(venues, {
    fields: [subscriptions.venueId],
    references: [venues.id],
  }),
  visits: many(serviceVisits),
}));

export const serviceVisitsRelations = relations(serviceVisits, ({ one }) => ({
  venue: one(venues, {
    fields: [serviceVisits.venueId],
    references: [venues.id],
  }),
  subscription: one(subscriptions, {
    fields: [serviceVisits.subscriptionId],
    references: [subscriptions.id],
  }),
}));
