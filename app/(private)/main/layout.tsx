import { SelectionProvider } from "@/context";
import { SlidePanelProvider } from "@/context/SlidePanelContext";
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
      <SlidePanelProvider>{children}</SlidePanelProvider>
    </SelectionProvider>
  );
}
