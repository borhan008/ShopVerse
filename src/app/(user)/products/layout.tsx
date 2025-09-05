import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserSidebar from "@/components/user-sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  );
}
