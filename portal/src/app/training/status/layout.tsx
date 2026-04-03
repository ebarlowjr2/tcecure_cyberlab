import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CRC Training Status - TCecure CyberLab",
  description: "Lab completion tracking for CRC CyberLab pods",
};

export default function TrainingStatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
