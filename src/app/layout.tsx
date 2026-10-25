import type { Metadata } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { AppExperience } from "@/components/layout/AppExperience";
import "./globals.css";
import "./v2.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const measurement = IBM_Plex_Mono({
  variable: "--font-measurement",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "VphyLAB v2 | Learn physics by doing",
  description:
    "Practice five physics experiments at home. Control the instruments, observe the physics, and export your readings for college labs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${archivo.variable} ${measurement.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppExperience>{children}</AppExperience>
      </body>
    </html>
  );
}
