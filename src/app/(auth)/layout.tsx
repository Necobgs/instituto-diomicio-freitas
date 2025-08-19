import AppSidebar from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-full">
        <nav className="p-4 bg-red-400 max-w-full">
            <SidebarTrigger className="text-emerald-950 bg-red-100"/>
        </nav>
        {children}
      </main>
    </SidebarProvider>
  );
}
