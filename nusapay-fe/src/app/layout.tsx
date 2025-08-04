import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import type React from "react";
import Navbar from "@/components/Navbar";
import { UserProvider } from "@/lib/UserContext";
import { TemplateProvider } from "@/lib/TemplateContext";
import Provider from "./provider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "NusaPay",
  description: "Powered by IDRX",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={poppins.className + " bg-[#000000] text-white"}>
    <Provider>
    <UserProvider>
      <TemplateProvider>
        <Navbar />
        <div className=" px-4 pt-[74px]">{children}</div>
      </TemplateProvider>
    </UserProvider>
    </Provider>
      </body>
    </html>
  );
}
