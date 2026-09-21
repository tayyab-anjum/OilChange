"use client";

import React, { useState, useEffect, useCallback } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardMetrics } from "@/components/dashboard/DashboardMetrics";
import {
  VisitsDataTable,
  type ServiceVisitRecord,
} from "@/components/dashboard/VisitsDataTable";
import {
  InquiriesDataTable,
  type InquiryRecord,
} from "@/components/dashboard/InquiriesDataTable";
import {
  SubscriptionsDataTable,
  type SubscriptionRecord,
} from "@/components/dashboard/SubscriptionsDataTable";
import { Truck, MessageSquare, Repeat, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"visits" | "inquiries" | "subscriptions">("visits");
  const [visits, setVisits] = useState<ServiceVisitRecord[]>([]);
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/dashboard/overview");
      const json = await res.json();
      if (!res.ok || !json.success) {
        setError(json.error || "Failed to load dashboard overview.");
      } else {
        setVisits(json.visits || []);
        setInquiries(json.inquiries || []);
        setSubscriptions(json.subscriptions || []);
      }
    } catch {
      setError("Network error fetching operator data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Status update handler for visits
  const handleVisitStatusUpdate = async (id: string, status: string, notes?: string) => {
    try {
      await fetch(`/api/dashboard/visits/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, technicianNotes: notes }),
      });

      // Update locally
      setVisits((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status, technicianNotes: notes !== undefined ? notes : v.technicianNotes } : v
        )
      );
    } catch (err) {
      console.error("Failed to update visit status:", err);
    }
  };

  // Status update handler for inquiries
  const handleInquiryStatusUpdate = async (id: string, status: string) => {
    try {
      await fetch(`/api/dashboard/inquiries/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status } : i))
      );
    } catch (err) {
      console.error("Failed to update inquiry status:", err);
    }
  };

  // Metrics calculations
  const scheduledCount = visits.filter((v) => v.status === "scheduled" || v.status === "en_route" || v.status === "in_progress").length;
  const newInquiriesCount = inquiries.filter((i) => i.status === "new").length;
  const projectedRevenue = visits
    .filter((v) => v.status !== "cancelled")
    .reduce((acc, curr) => acc + Number(curr.estimatedPrice || 0), 0);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Operator Header */}
      <DashboardHeader onRefresh={fetchDashboardData} />

      {/* Main Dashboard Content */}
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* Error Banner if any */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Solo Operator Key Metric Strips */}
        <DashboardMetrics
          totalVisits={visits.length}
          scheduledVisits={scheduledCount}
          inquiriesCount={inquiries.length}
          newInquiriesCount={newInquiriesCount}
          subscriptionsCount={subscriptions.length}
          projectedRevenue={projectedRevenue}
        />

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-2 border-b border-surface-border mb-6 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab("visits")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "visits"
                ? "border-accent text-white"
                : "border-transparent text-content-muted hover:text-content-secondary"
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Route Visits Queue ({visits.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("inquiries")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "inquiries"
                ? "border-accent text-white"
                : "border-transparent text-content-muted hover:text-content-secondary"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Inbound Leads ({inquiries.length})</span>
            {newInquiriesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("subscriptions")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "subscriptions"
                ? "border-accent text-white"
                : "border-transparent text-content-muted hover:text-content-secondary"
            }`}
          >
            <Repeat className="w-4 h-4" />
            <span>Active Subscriptions ({subscriptions.length})</span>
          </button>
        </div>

        {/* Dynamic Tab Panel */}
        <div>
          {activeTab === "visits" && (
            <VisitsDataTable
              visits={visits}
              isLoading={isLoading}
              onStatusUpdate={handleVisitStatusUpdate}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesDataTable
              inquiries={inquiries}
              isLoading={isLoading}
              onStatusUpdate={handleInquiryStatusUpdate}
            />
          )}

          {activeTab === "subscriptions" && (
            <SubscriptionsDataTable subscriptions={subscriptions} />
          )}
        </div>

      </main>
    </div>
  );
}
