import AppSidebar from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function RootAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full">
          <nav className="h-16 p-4 bg-red-400 flex items-center justify-start">
            <SidebarTrigger className="text-emerald-950 bg-red-100" />
          </nav>
          <div className="flex-1 p-4">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}