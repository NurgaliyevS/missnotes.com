import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
    return (<Html lang="en" className="scroll-smooth">
      <Head>
        <link rel="icon" href="/notebook-pen.png"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>);
}
