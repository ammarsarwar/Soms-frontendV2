import type { Metadata } from "next";
import Sidebar from "@/components/Layouts/side-bar";
import Navbar from "@/components/Layouts/nav-bar";

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  description: "SOMS - School management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex flex-col flex-1">
        <div className="ml-72">
          <Navbar />
          <div className="p-6 bg-background h-screen">{children}</div>
        </div>
      </main>
    </div>
  );
}
