import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
    return (<Html lang="en" className="scroll-smooth">
      <Head>
        <title>
          MissNotes
        </title>
        <meta name="description" content="Never leave a meeting without clear notes again - MissNotes"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <link rel="icon" href="/notebook-pen.png"/>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>);
}
