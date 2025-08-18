import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import '../styles/globals.css';
export default function App(_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    var queryClient = useState(function () { return new QueryClient(); })[0];
    return (<QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Component {...pageProps}/>
      </TooltipProvider>
    </QueryClientProvider>);
}
