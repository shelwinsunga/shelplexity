import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theming/theme-provider";
import Nav from "@/components/nav/nav";
import { AI } from "./actions";
import { FrontendProvider } from "@/contexts/FrontendContext";
import { getRecentThreads } from "@/actions/threadActions";
import { TooltipProvider } from "@/components/ui/tooltip";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Shelplexity",
  description: "Shelplexity is a search engine for the Shelly ecosystem.",
};
export const maxDuration = 60;

export default async function RootLayout({
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
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <AI>
            <FrontendProvider>
              <TooltipProvider>
                <Nav />
                {children}
              </TooltipProvider>
            </FrontendProvider>
          </AI>
        </ThemeProvider>
      </body>
    </html>
  );
}
