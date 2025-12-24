import { SelectionProvider, ViewProvider } from "@/context";
import { SlidePanelProvider } from "@/context/SlidePanelContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
import { SidebarProvider } from "@/context/SidebarContext";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Main - SaveSite",
  description: "Manage and organize your saved websites",
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SelectionProvider>
      <ViewProvider>
        <SidebarProvider>
          <SlidePanelProvider>
            <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
          </SlidePanelProvider>
        </SidebarProvider>
      </ViewProvider>
    </SelectionProvider>
  );
}
