import type { Metadata } from "next";
import "./globals.css";
import StructuredData from "@/components/seo/StructuredData";

export const metadata: Metadata = {
  title: "سوفت تسعة وتسعين | قطع غيار وزيوت الدراجات النارية في جيزان",
  description: "متجر متخصص في قطع الغيار الأصلية وزيوت الصيانة والإكسسوارات للدراجات النارية في جيزان. زيوت موتول، فلاتر، بطاريات وقطع غيار عالية الجودة.",
  keywords: "قطع غيار دراجات نارية، زيوت دراجات، فلاتر دراجات، بطاريات دراجات، إكسسوارات دراجات نارية، متجر قطع غيار جيزان، موتول زيت، فلاتر هيفلو",
  authors: [{ name: "سوفت تسعة وتسعين" }],
  creator: "سوفت تسعة وتسعين",
  publisher: "سوفت تسعة وتسعين",
  openGraph: {
    title: "سوفت تسعة وتسعين | قطع غيار وزيوت الدراجات النارية",
    description: "متجر متخصص في قطع الغيار الأصلية وزيوت الصيانة للدراجات النارية في جيزان",
    url: "https://soft99bikes.com",
    siteName: "سوفت تسعة وتسعين",
    images: [
      {
        url: "/logo.svg",
        width: 1200,
        height: 630,
        alt: "سوفت تسعة وتسعين - قطع غيار الدراجات النارية",
      },
    ],
    locale: "ar_SA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سوفت تسعة وتسعين | قطع غيار وزيوت الدراجات النارية",
    description: "متجر متخصص في قطع الغيار الأصلية وزيوت الصيانة للدراجات النارية",
    images: ["/logo.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://soft99bikes.com",
  },
};

import { Cairo } from "next/font/google";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
});

import QueryProvider from "@/providers/QueryProvider";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import { ToastProvider } from "@/contexts/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <StructuredData />
        <link rel="icon" href="/logo.svg" sizes="any" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/logo.svg" />
        <meta name="theme-color" content="#E50914" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${cairo.variable} font-sans antialiased`}>
        <QueryProvider>
          <ToastProvider>
            <ServiceWorkerRegister />
            {children}
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
