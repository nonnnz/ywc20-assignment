import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import FooterSection from "@/components/footer-section";
import HeaderSection from "@/components/header-section";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["latin", "thai"],
});

export const metadata: Metadata = {
  title: "YWC20 Assignment",
  description:
    "Young Webmaster Camp 20 Assignment for announcing application results",
  keywords: ["young webmaster camp", "coding bootcamp"],
  authors: [{ name: "Ratchanon B." }],
  openGraph: {
    title: "YWC20 Assignment",
    description:
      "Young Webmaster Camp 20 Assignment for announcing application results",
    url: "https://localhost:3000",
    siteName: "YWC20 Assignment",
    locale: "th",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "YWC20 Assignment",
    description:
      "Young Webmaster Camp 20 Assignment for announcing application results",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning className="dark">
      <body
        className={`${notoSans.variable} ${notoSansThai.variable} antialiased`}
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <HeaderSection />
            <div className="flex flex-1 justify-center">{children}</div>
            <FooterSection />
          </div>
        </Providers>
      </body>
    </html>
  );
}
