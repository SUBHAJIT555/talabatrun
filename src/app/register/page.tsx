import type { Metadata } from "next";
import { RegisterScreen } from "@/components/register/RegisterScreen";

export const metadata: Metadata = {
  title: "What's your name?",
  description: "Enter your name to play Rider Rush.",
};

export default function RegisterPage() {
  return <RegisterScreen />;
}
