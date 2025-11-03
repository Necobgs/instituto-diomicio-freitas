'use client'

import AppSidebar from "@/components/layout/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useSelector } from "react-redux";
import { redirect } from 'next/navigation';
import { selectIsAuthenticated } from "@/store/features/userSlice";
import { useEffect } from "react";

export default function RootAuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/login");
    }
  },[isAuthenticated]) 

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        <AppSidebar />
        <main className="flex-1 flex flex-col w-full min-w-0">
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