import type { Metadata } from "next";
import { HomeScreen } from "@/components/home/HomeScreen";

export const metadata: Metadata = {
  title: "Rider Rush",
  description: "Deliver the good stuff.",
};

export default function HomePage() {
  return <HomeScreen />;
}
