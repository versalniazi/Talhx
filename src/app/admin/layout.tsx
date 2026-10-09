import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Team Inbox | TALHX" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-screen flex-col bg-mist">{children}</div>;
}
