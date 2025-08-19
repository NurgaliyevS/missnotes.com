import { SessionProvider } from "next-auth/react";
import { Header } from "../src/components/Header";
import "../styles/globals.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Header />
      <Component {...pageProps} />
      <script
        defer
        data-website-id="68a3894d82f5236bced090dd"
        data-domain="missnotes.com"
        src="https://datafa.st/js/script.js"
      ></script>
    </SessionProvider>
  );
}
