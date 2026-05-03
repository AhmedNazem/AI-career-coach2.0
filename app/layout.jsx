import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import ClerkThemeProvider from "@/components/ClerkThemeProvider";
import Header from "@/components/Header";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });
export const metadata = {
  title: {
    default: "Sensai - AI Career Coach",
    template: "%s | Sensai",
  },
  description:
    "Master your career with Sensai. AI-powered roadmaps, professional mock interviews, and automated job tracking to help you land your dream role.",
  keywords: [
    "AI Career Coach",
    "Interview Preparation",
    "Career Roadmap",
    "Job Tracker",
    "AI Resume Review",
  ],
  authors: [{ name: "Ahmed" }],
  creator: "Ahmed",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-career-coach2-0.vercel.app/",
    siteName: "Sensai",
    title: "Sensai - AI Career Coach",
    description:
      "Master your career with AI-powered roadmaps and mock interviews.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Sensai AI Career Coach",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sensai - AI Career Coach",
    description:
      "Master your career with AI-powered roadmaps and mock interviews.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkThemeProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="bg-muted/50 py-12">
              <div className="container mx-auto px-4 text-center text-muted-foreground">
                <p>
                  Made with ☕ by Ahmed{" "}
                  <span className="text-yellow-500">:D</span>
                </p>
              </div>
            </footer>
          </ClerkThemeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
