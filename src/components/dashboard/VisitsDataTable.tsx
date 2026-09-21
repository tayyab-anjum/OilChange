"use client";

import React, { useState } from "react";
import {
  Truck,
  Clock,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Edit3,
  Calendar,
  Layers,
  ChevronRight,
  Search,
  Navigation,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface ServiceVisitRecord {
  id: string;
  referenceCode: string;
  venueId: string;
  subscriptionId?: string | null;
  serviceType: string;
  frequency?: string | null;
  status: string;
  scheduledAt?: string | Date | null;
  preferredDay?: string | null;
  preferredTimeWindow?: string | null;
  estimatedPrice: string | number;
  fryerCount: number;
  addons?: Array<{ id: string; name: string; price: number }> | null;
  technicianNotes?: string | null;
  completedAt?: string | Date | null;
  createdAt: string | Date;
  venue?: {
    id: string;
    businessName: string;
    contactName: string;
    email: string;
    phone: string;
    address: string;
    venueType: string;
    fryerCount: number;
  } | null;
}

interface VisitsTableProps {
  visits: ServiceVisitRecord[];
  isLoading?: boolean;
  onStatusUpdate: (id: string, status: string, notes?: string) => Promise<void>;
}

export function VisitsDataTable({
  visits,
  isLoading,
  onStatusUpdate,
}: VisitsTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<ServiceVisitRecord | null>(null);
  const [techNotes, setTechNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  // Filtered visits
  const filteredVisits = visits.filter((v) => {
    const matchesStatus = filterStatus === "all" || v.status === filterStatus;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      v.referenceCode.toLowerCase().includes(query) ||
      (v.venue?.businessName || "").toLowerCase().includes(query) ||
      (v.venue?.address || "").toLowerCase().includes(query) ||
      (v.venue?.contactName || "").toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  const openDetailModal = (v: ServiceVisitRecord) => {
    setSelectedVisit(v);
    setTechNotes(v.technicianNotes || "");
  };

  const handleQuickStatus = async (id: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(id, newStatus);
      if (selectedVisit && selectedVisit.id === id) {
        setSelectedVisit((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedVisit) return;
    setIsUpdating(true);
    try {
      await onStatusUpdate(selectedVisit.id, selectedVisit.status, techNotes);
      setSelectedVisit((prev) => (prev ? { ...prev, technicianNotes: techNotes } : null));
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">
            <Clock className="w-2.5 h-2.5" />
            Scheduled
          </span>
        );
      case "en_route":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Truck className="w-2.5 h-2.5" />
            En Route
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-accent/20 text-accent border border-accent/40 animate-pulse">
            <Layers className="w-2.5 h-2.5" />
            Servicing
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-2.5 h-2.5" />
            Done
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-red-500/15 text-red-400 border border-red-500/30">
            Cancelled
          </span>
        );
      default:
        return <span className="text-xs text-content-muted">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="surface-panel p-4 sm:p-6 rounded-card border border-surface-border space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="surface-panel rounded-card border border-surface-border overflow-hidden">
      
      {/* Table / List Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-surface-border flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#181B1E]">
        <div>
          <h3 className="font-headline text-xl sm:text-2xl font-bold text-white leading-tight">
            DISPATCH QUEUE ({filteredVisits.length})
          </h3>
          <p className="text-[11px] text-content-muted hidden sm:block">
            Today&apos;s route schedule and customer stops.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative w-full sm:w-48">
            <Search className="w-3.5 h-3.5 text-content-subtle absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stops..."
              className="h-9 pl-9 pr-3 w-full rounded-lg bg-background-deep border border-surface-border text-xs text-white placeholder:text-content-subtle focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div className="flex items-center gap-1 bg-surface-elevated p-1 rounded-lg border border-surface-border overflow-x-auto text-[11px]">
            {["all", "scheduled", "en_route", "in_progress", "completed"].map((st) => (
              <button
                type="button"
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2 py-1 rounded capitalize font-medium whitespace-nowrap transition-colors ${
                  filterStatus === st
                    ? "bg-accent text-white font-bold"
                    : "text-content-secondary hover:text-white"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredVisits.length === 0 ? (
        <div className="p-10 text-center text-content-muted">
          <Truck className="w-10 h-10 text-content-subtle mx-auto mb-2 opacity-40" />
          <h4 className="font-headline text-lg text-white font-bold mb-1">
            NO ROUTE STOPS FOUND
          </h4>
          <p className="text-xs max-w-xs mx-auto">
            {searchQuery || filterStatus !== "all"
              ? "No stops match your filter."
              : "No scheduled visits in the queue."}
          </p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (<768px): STACKED ACTION CARDS (Zero Horizontal Scroll) */}
          <div className="md:hidden divide-y divide-surface-border/60 p-3 space-y-3">
            {filteredVisits.map((v) => (
              <div
                key={v.id}
                onClick={() => openDetailModal(v)}
                className="surface-panel p-4 rounded-xl border border-surface-border bg-surface-elevated/40 space-y-3 active:bg-surface-elevated transition-colors cursor-pointer"
              >
                {/* Card Top Line: Code & Status */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-accent">
                    {v.referenceCode}
                  </span>
                  {getStatusBadge(v.status)}
                </div>

                {/* Venue Name & Manager */}
                <div>
                  <h4 className="font-headline text-lg font-bold text-white leading-tight">
                    {v.venue?.businessName || "Venue Account"}
                  </h4>
                  <p className="text-xs text-content-secondary flex items-center gap-1 mt-0.5">
                    <span>Contact:</span>
                    <span className="font-semibold text-white">{v.venue?.contactName}</span>
                  </p>
                </div>

                {/* Location & Time */}
                <div className="space-y-1 text-xs text-content-muted bg-background-deep p-2.5 rounded-lg border border-surface-border">
                  <div className="flex items-start gap-1.5 text-content-secondary">
                    <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                    <span className="leading-snug">{v.venue?.address}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-border/40 text-[11px]">
                    <span className="flex items-center gap-1 capitalize text-white">
                      <Calendar className="w-3 h-3 text-accent" />
                      {v.preferredDay || "Flexible"} ({v.preferredTimeWindow?.replace(/_/g, " ") || "Morning"})
                    </span>
                    <span className="font-mono font-bold text-white">
                      {v.fryerCount} vats • ${Number(v.estimatedPrice).toFixed(0)}
                    </span>
                  </div>
                </div>

                {/* Mobile Quick Action Strip (Full width buttons in thumb-zone) */}
                <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  {v.venue?.phone && (
                    <a
                      href={`tel:${v.venue.phone}`}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-surface border border-surface-border text-center text-xs font-bold text-white flex items-center justify-center gap-1.5 hover:border-accent"
                    >
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span>Call</span>
                    </a>
                  )}

                  {v.status === "scheduled" && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatus(v.id, "en_route")}
                      disabled={isUpdating}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-center text-xs font-bold hover:bg-amber-500/30"
                    >
                      En Route
                    </button>
                  )}

                  {v.status === "en_route" && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatus(v.id, "in_progress")}
                      disabled={isUpdating}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-accent text-white text-center text-xs font-bold hover:bg-accent-hover"
                    >
                      Start Service
                    </button>
                  )}

                  {v.status === "in_progress" && (
                    <button
                      type="button"
                      onClick={() => handleQuickStatus(v.id, "completed")}
                      disabled={isUpdating}
                      className="flex-1 py-2.5 px-3 rounded-lg bg-emerald-500 text-white text-center text-xs font-bold hover:bg-emerald-600"
                    >
                      Complete
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => openDetailModal(v)}
                    className="p-2.5 rounded-lg bg-surface border border-surface-border text-content-secondary hover:text-white"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW (≥768px): FULL DATA TABLE */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-surface-border bg-background-deep/60 text-[11px] font-mono text-content-muted uppercase">
                  <th className="py-3 px-4 font-semibold">Ref Code</th>
                  <th className="py-3 px-4 font-semibold">Venue & Address</th>
                  <th className="py-3 px-4 font-semibold">Schedule & Window</th>
                  <th className="py-3 px-4 font-semibold">Fryers</th>
                  <th className="py-3 px-4 font-semibold">Rate</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {filteredVisits.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-surface-elevated/40 transition-colors cursor-pointer group"
                    onClick={() => openDetailModal(v)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-accent">
                      {v.referenceCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-headline text-sm font-bold text-white block group-hover:text-accent transition-colors">
                        {v.venue?.businessName || "Venue Account"}
                      </span>
                      <span className="text-[11px] text-content-muted flex items-center gap-1 mt-0.5 truncate max-w-xs">
                        <MapPin className="w-3 h-3 text-content-subtle shrink-0" />
                        {v.venue?.address}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary">
                      <span className="capitalize font-semibold text-white block">
                        {v.preferredDay || "Flexible"}
                      </span>
                      <span className="text-[11px] text-content-muted block">
                        {v.preferredTimeWindow?.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-white">
                      {v.fryerCount} vats
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      ${Number(v.estimatedPrice).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(v.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        {v.status === "scheduled" && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(v.id, "en_route")}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-amber-400 hover:bg-amber-500/25 text-[11px] font-bold"
                          >
                            En Route
                          </button>
                        )}
                        {v.status === "en_route" && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(v.id, "in_progress")}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded bg-accent text-white hover:bg-accent-hover text-[11px] font-bold"
                          >
                            Start
                          </button>
                        )}
                        {v.status === "in_progress" && (
                          <button
                            type="button"
                            onClick={() => handleQuickStatus(v.id, "completed")}
                            disabled={isUpdating}
                            className="px-2.5 py-1 rounded bg-emerald-500 text-white hover:bg-emerald-600 text-[11px] font-bold"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => openDetailModal(v)}
                          className="p-1.5 rounded bg-surface border border-surface-border text-content-secondary hover:text-white"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* VISIT DETAIL MODAL DRILLDOWN */}
      {selectedVisit && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="surface-panel w-full max-w-2xl rounded-2xl border border-surface-border bg-surface p-5 sm:p-8 shadow-elevation-modal max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-start justify-between pb-3 border-b border-surface-border mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-accent">
                    {selectedVisit.referenceCode}
                  </span>
                  {getStatusBadge(selectedVisit.status)}
                </div>
                <h3 className="font-headline text-xl sm:text-2xl font-extrabold text-white">
                  {selectedVisit.venue?.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVisit(null)}
                className="p-1.5 rounded-lg bg-surface-elevated text-content-secondary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
              <div className="p-3 rounded-xl bg-background-deep border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-content-muted block">Contact</span>
                  <span className="font-bold text-white">{selectedVisit.venue?.contactName}</span>
                </div>
                <a
                  href={`tel:${selectedVisit.venue?.phone}`}
                  className="p-2 rounded-lg bg-accent/15 text-accent hover:bg-accent hover:text-white font-bold flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call</span>
                </a>
              </div>

              <div className="p-3 rounded-xl bg-background-deep border border-surface-border">
                <span className="text-[10px] font-mono uppercase text-content-muted block">Address</span>
                <span className="text-content-secondary">{selectedVisit.venue?.address}</span>
              </div>

              <div className="p-3 rounded-xl bg-background-deep border border-surface-border">
                <span className="text-[10px] font-mono uppercase text-content-muted block">Scope</span>
                <span className="font-bold text-white">{selectedVisit.fryerCount} Fryer Vats</span>
                <span className="text-content-muted block text-[11px] capitalize">{selectedVisit.serviceType.replace("_", " ")}</span>
              </div>

              <div className="p-3 rounded-xl bg-background-deep border border-surface-border">
                <span className="text-[10px] font-mono uppercase text-content-muted block">Rate</span>
                <span className="font-headline text-xl font-bold text-white">${Number(selectedVisit.estimatedPrice).toFixed(2)}</span>
              </div>
            </div>

            {/* Technician Notes */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-content-secondary mb-1 flex items-center gap-1">
                <Edit3 className="w-3.5 h-3.5 text-accent" />
                <span>Alley Notes / Access</span>
              </label>
              <textarea
                rows={2}
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                placeholder="Alley code, key location, oil disposal notes..."
                className="w-full px-3 py-2 rounded-lg bg-background-deep border border-surface-border text-xs text-white focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={isUpdating}
                className="mt-1 text-xs font-bold text-accent hover:underline float-right disabled:opacity-50"
              >
                {isUpdating ? "Saving..." : "Save Notes"}
              </button>
            </div>

            {/* Status Change Buttons */}
            <div className="pt-3 border-t border-surface-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 clear-both text-xs">
              <span className="text-content-muted font-mono text-[11px]">Update Job Status:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickStatus(selectedVisit.id, "en_route")}
                  className="py-2 px-2.5 rounded bg-amber-500/20 text-amber-300 font-bold text-center"
                >
                  En Route
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStatus(selectedVisit.id, "in_progress")}
                  className="py-2 px-2.5 rounded bg-accent text-white font-bold text-center"
                >
                  Servicing
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickStatus(selectedVisit.id, "completed")}
                  className="py-2 px-2.5 rounded bg-emerald-500 text-white font-bold text-center"
                >
                  Completed
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
