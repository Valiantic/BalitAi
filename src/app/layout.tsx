import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next"
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const siteUrl = "https://balita-ai.vercel.app";
const title = "BalitAI - AI News Agent";
const description = "BalitAI - Your AI News Platform for the Latest issues in the Philippines";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "BalitAI",
      url: `${siteUrl}/`,
      logo: `${siteUrl}/images/logo.png`,
      sameAs: ["https://github.com/Valiantic/BalitAi"],
    },
    { "@type": "WebSite", name: "BalitAI", url: `${siteUrl}/`, description },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
    url: "/",
    siteName: "BalitAI",
    type: "website",
    images: [{ url: "/images/logo.png", width: 359, height: 318, alt: "BalitAI logo" }],
  },
  icons: {
    icon: [
      {
        url: "/images/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={poppins.className}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
