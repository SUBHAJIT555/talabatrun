import type { Metadata } from "next";
import { CountdownScreen } from "@/components/countdown/CountdownScreen";

export const metadata: Metadata = {
  title: "Get ready",
  description: "Countdown before Rider Rush starts.",
};

export default function CountdownPage() {
  return <CountdownScreen />;
}
