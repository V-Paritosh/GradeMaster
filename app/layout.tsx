import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { GlobalAlert } from "@/components/GlobalAlert";

export const metadata: Metadata = {
  title: "D211 GradeMaster",
  description:
    "A free, student-built grade calculator designed for Township High School District 211 students. Track classes, assignments, weighted categories, percentages, final grades, and GPA in one place. A modern GradeMaster alternative for Schaumburg High School and other D211 schools.",

  keywords: [
    "D211 grade calculator",
    "D211 GPA calculator",
    "Township High School District 211 grade calculator",
    "Township High School District 211 GPA calculator",
    "District 211 student grade and GPA tracker",
    "Schaumburg High School GPA calculator",
    "Schaumburg High School grade calculator",
    "D211 high school grade calculator",
    "high school GPA calculator",
    "weighted GPA calculator",
    "unweighted GPA calculator",
    "GradeMaster D211",
    "GradeMaster GPA calculator",
    "GradeMaster alternative for D211",
    "student grade and GPA tracker",
    "assignment and class grade calculator",
    "final grade calculator",
    "online grade and GPA calculator for students",
    "free GPA calculator for high school students",
    "student-built academic tools",
    "tools for D211 students",
  ],

  authors: [
    { name: "Paritosh Vaghasiya", url: "https://v-paritosh.github.io/" },
  ],
  creator: "Paritosh Vaghasiya",
  robots: "index, follow",

  verification: {
    google: "tfDueTzOrSEWyXNETy1bgUWpBCDIe6--P3VI26uGxf0",
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/assets/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/assets/favicon/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    title: "D211 GradeMaster",
  },

  openGraph: {
    title: "D211 GradeMaster - Grade Calculator",
    description:
      "Track your grades across all Township High School District 211 classes with this free grade calculator. Built by a student for D211 students.",
    url: "https://grademaster211.netlify.app",
    siteName: "D211 Grade Calculator",
    images: [
      {
        url: "https://grademaster211.netlify.app/assets/ogBanner.png",
        width: 1200,
        height: 630,
        alt: "D211 Grade Calculator for High School Students",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "D211 GradeMaster - Grade Calculator",
    description:
      "A free alternative to calculate grades for Township High School District 211 students.",
    images: ["https://grademaster211.netlify.app/assets/ogBanner.png"],
  },

  alternates: {
    canonical: "https://grademaster211.netlify.app",
  },

  
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" >
      <body>
        <Providers>
          <GlobalAlert />
          {children}
        </Providers>
      </body>
    </html>
  );
}