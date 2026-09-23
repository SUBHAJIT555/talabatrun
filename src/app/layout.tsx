import type { Metadata } from "next";
import { PageCurtains } from "@/components/motion/PageCurtains";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talabat Run",
  description: "Portrait event runner game",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body className="h-dvh overflow-hidden bg-neutral-950 text-neutral-100 antialiased">
        <PageCurtains>{children}</PageCurtains>
      </body>
    </html>
  );
}
