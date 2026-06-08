import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saytica Eval Console",
  description: "Model evaluation leaderboard and task progress console.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
