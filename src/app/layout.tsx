import type { Metadata } from "next";
import "./globals.css";
import { IDEProvider } from "@/context/IDEContext";

export const metadata: Metadata = {
  title: "Ela IDE — Premium AI-Powered Web IDE",
  description:
    "Professional browser-based AI development environment inspired by VS Code, Cursor and Windsurf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0f0f11] text-zinc-100 h-screen w-screen overflow-hidden">
        <IDEProvider>{children}</IDEProvider>
      </body>
    </html>
  );
}
