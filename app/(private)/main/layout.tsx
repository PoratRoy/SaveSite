"use client";

import {
  DataProvider,
  FilterProvider,
  SearchProvider,
  SelectionProvider,
  useSelection,
} from "@/context";
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
  const { updateSelection } = useSelection();
  return (
    <SelectionProvider>
      <SlidePanelProvider>
        <DataProvider onDataChange={updateSelection}>
          <SearchProvider>
            <FilterProvider>{children}</FilterProvider>
          </SearchProvider>
        </DataProvider>
      </SlidePanelProvider>
    </SelectionProvider>
  );
}
