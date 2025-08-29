import { SessionProvider } from "next-auth/react";
import { Header } from "../src/components/Header";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";
import CrispChat from "@/components/CrispChat";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
      <Toaster position="top-right" />
      <script
        defer
        data-website-id="68a3894d82f5236bced090dd"
        data-domain="missnotes.com"
        src="https://datafa.st/js/script.js"
      ></script>
      <CrispChat websiteId="04ba1888-06e9-41c9-bffa-3804767583e5" />
    </SessionProvider>
  );
}
