import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { Header } from "@/components/Header";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <TooltipProvider>
        <Header />
        <Toaster />
        <Sonner />
        <Component {...pageProps} />
      </TooltipProvider>
      <script
        defer
        data-website-id="68a3894d82f5236bced090dd"
        data-domain="missnotes.com"
        src="https://datafa.st/js/script.js"
      ></script>
    </SessionProvider>
  );
}
