import { SelectionProvider } from "@/context";
import { SlidePanelProvider } from "@/context/SlidePanelContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
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
      <SlidePanelProvider>
        <ConfirmDialogProvider>{children}</ConfirmDialogProvider>
      </SlidePanelProvider>
    </SelectionProvider>
  );
}
