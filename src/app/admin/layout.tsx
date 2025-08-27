import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <div className="fixed flex min-w-screen h-[50px] z-[10] backdrop-blur-sm  gap-x-2 items-center border-b">
          <SidebarTrigger />
          <h2 className="">Admin Panel</h2>
        </div>
        <div className="px-2 mt-[60px]">{children}</div>
      </main>
    </SidebarProvider>
  );
}
