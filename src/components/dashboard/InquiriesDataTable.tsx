"use client";

import React, { useState } from "react";
import { MessageSquare, Phone, Mail, Clock, CheckCircle2, ChevronRight, X, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface InquiryRecord {
  id: string;
  referenceCode: string;
  name: string;
  email: string;
  phone: string;
  businessName: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string | Date;
}

interface InquiriesTableProps {
  inquiries: InquiryRecord[];
  isLoading?: boolean;
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}

export function InquiriesDataTable({
  inquiries,
  isLoading,
  onStatusUpdate,
}: InquiriesTableProps) {
  const [selectedInq, setSelectedInq] = useState<InquiryRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (id: string, status: string) => {
    setIsUpdating(true);
    try {
      await onStatusUpdate(id, status);
      if (selectedInq && selectedInq.id === id) {
        setSelectedInq((prev) => (prev ? { ...prev, status } : null));
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-accent/20 text-accent border border-accent/40 animate-pulse">
            New Lead
          </span>
        );
      case "contacted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-sky-500/15 text-sky-400 border border-sky-500/30">
            Contacted
          </span>
        );
      case "quoted":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400 border border-amber-500/30">
            Quoted
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            Closed
          </span>
        );
      default:
        return <span className="text-xs text-content-muted">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="surface-panel p-4 sm:p-6 rounded-card border border-surface-border space-y-3">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="surface-panel rounded-card border border-surface-border overflow-hidden">
      <div className="p-4 sm:p-5 border-b border-surface-border bg-[#181B1E] flex items-center justify-between">
        <div>
          <h3 className="font-headline text-xl sm:text-2xl font-bold text-white leading-tight">
            INBOUND LEADS ({inquiries.length})
          </h3>
          <p className="text-[11px] text-content-muted hidden sm:block">
            Customer inquiries requiring callback or quote confirmation.
          </p>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-8 text-center text-content-muted">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
          <h4 className="font-headline text-base text-white font-bold mb-0.5">
            ALL LEADS CONTACTED
          </h4>
          <p className="text-xs">No pending messages in the queue.</p>
        </div>
      ) : (
        <>
          {/* MOBILE VIEW (<768px): STACKED LEAD CARDS (Zero Horizontal Scroll) */}
          <div className="md:hidden divide-y divide-surface-border/60 p-3 space-y-3">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInq(inq)}
                className="surface-panel p-4 rounded-xl border border-surface-border bg-surface-elevated/40 space-y-3 active:bg-surface-elevated transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    {inq.referenceCode}
                  </span>
                  {getStatusBadge(inq.status)}
                </div>

                <div>
                  <h4 className="font-headline text-lg font-bold text-white leading-tight">
                    {inq.businessName}
                  </h4>
                  <p className="text-xs text-content-secondary mt-0.5">
                    Contact: <span className="font-semibold text-white">{inq.name}</span>
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-background-deep border border-surface-border text-xs text-content-secondary space-y-1">
                  <span className="text-[10px] font-mono uppercase text-accent font-bold block">
                    Subject: {inq.subject}
                  </span>
                  <p className="line-clamp-2 text-content-muted leading-relaxed">
                    {inq.message}
                  </p>
                </div>

                {/* Mobile Direct Callback Action */}
                <div className="flex items-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                  <a
                    href={`tel:${inq.phone}`}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-accent text-white text-center text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-accent-hover"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call ({inq.phone})</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setSelectedInq(inq)}
                    className="py-2.5 px-3.5 rounded-lg bg-surface border border-surface-border text-xs text-content-secondary hover:text-white"
                  >
                    Read
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
                  <th className="py-3 px-4 font-semibold">Customer & Business</th>
                  <th className="py-3 px-4 font-semibold">Phone / Callback</th>
                  <th className="py-3 px-4 font-semibold">Subject</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">View</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/60">
                {inquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    className="hover:bg-surface-elevated/40 transition-colors cursor-pointer group"
                    onClick={() => setSelectedInq(inq)}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-sky-400">
                      {inq.referenceCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-headline text-sm font-bold text-white block group-hover:text-accent transition-colors">
                        {inq.businessName}
                      </span>
                      <span className="text-[11px] text-content-muted">
                        {inq.name}
                      </span>
                    </td>
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <a
                        href={`tel:${inq.phone}`}
                        className="font-mono text-accent hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3 h-3" />
                        <span>{inq.phone}</span>
                      </a>
                    </td>
                    <td className="py-3.5 px-4 text-content-secondary max-w-xs truncate">
                      {inq.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(inq.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedInq(inq)}
                        className="p-1.5 rounded bg-surface border border-surface-border text-content-secondary hover:text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* INQUIRY DETAIL MODAL */}
      {selectedInq && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="surface-panel w-full max-w-lg rounded-2xl border border-surface-border bg-surface p-5 sm:p-7 shadow-elevation-modal relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-3 border-b border-surface-border mb-4">
              <div>
                <span className="font-mono text-xs font-bold text-sky-400 block mb-0.5">
                  {selectedInq.referenceCode}
                </span>
                <h3 className="font-headline text-xl font-bold text-white">
                  {selectedInq.businessName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInq(null)}
                className="p-1.5 rounded-lg bg-surface-elevated text-content-secondary hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 mb-3 text-xs">
              <div className="p-2.5 rounded-lg bg-background-deep border border-surface-border">
                <span className="text-content-muted block text-[10px] font-mono uppercase">Contact</span>
                <span className="font-bold text-white">{selectedInq.name}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-background-deep border border-surface-border flex items-center justify-between">
                <div>
                  <span className="text-content-muted block text-[10px] font-mono uppercase">Phone</span>
                  <span className="font-bold text-accent">{selectedInq.phone}</span>
                </div>
                <a
                  href={`tel:${selectedInq.phone}`}
                  className="p-1.5 rounded bg-accent/20 text-accent hover:bg-accent hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-background-deep border border-surface-border mb-4">
              <span className="text-xs font-mono font-bold text-accent uppercase block mb-1">
                Subject: {selectedInq.subject}
              </span>
              <p className="text-xs text-content-secondary leading-relaxed whitespace-pre-wrap">
                {selectedInq.message}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-3 border-t border-surface-border text-xs">
              <span className="text-content-muted text-[11px]">Set Lead Status:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedInq.id, "contacted")}
                  disabled={isUpdating}
                  className="py-1.5 px-2 rounded bg-sky-500/20 text-sky-400 font-bold text-center"
                >
                  Contacted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedInq.id, "quoted")}
                  disabled={isUpdating}
                  className="py-1.5 px-2 rounded bg-amber-500/20 text-amber-400 font-bold text-center"
                >
                  Quoted
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChange(selectedInq.id, "closed")}
                  disabled={isUpdating}
                  className="py-1.5 px-2 rounded bg-emerald-500 text-white font-bold text-center"
                >
                  Closed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
