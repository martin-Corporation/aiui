import { JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/header";
import { ChatSidebar } from "@/components/chat-sidebar";
import "@fontsource-variable/inter/opsz";
import { APP_NAME } from "@/lib/brand";
import type { Metadata } from "next";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ChatStoreProvider } from "@/lib/chat-store";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jet-brains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: `The official ${APP_NAME} website`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col bg-background text-foreground">
        <TooltipProvider delay={0}>
          <ChatStoreProvider>
            <SidebarProvider defaultOpen={false}>
              <ChatSidebar />
              <div className="isolate flex flex-col flex-1">
                <Header />
                {children}
              </div>
              <Toaster />
            </SidebarProvider>
          </ChatStoreProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
