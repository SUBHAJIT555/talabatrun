import type { Metadata } from "next";
import { InstructionScreen } from "@/components/instructions/InstructionScreen";

export const metadata: Metadata = {
  title: "How to Play",
  description: "Collect good food, avoid junk food, and score as high as you can.",
};

export default function InstructionsPage() {
  return <InstructionScreen />;
}
