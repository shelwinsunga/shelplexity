import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theming/theme-provider"
import Nav from "@/components/nav/nav";
import { AI } from './actions';
import { FrontendProvider } from '@/contexts/FrontendContext';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shelplexity",
  description: "Shelplexity is a search engine for the Shelly ecosystem.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Nav />
          <AI>
            <FrontendProvider>
              {children}
            </FrontendProvider>
          </AI>
        </ThemeProvider>
      </body>
    </html>
  );
}
