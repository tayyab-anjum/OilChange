import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solo Operator Dispatch Hub | FryerCare",
  description: "Internal route management and client service dispatch for FryerCare.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
