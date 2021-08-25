import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          {/** NOTE(amine): used to communicate with the extension via classNames.
           *   e.g. if the extension is installed on the user's browser, it will add 'isDownloaded' to className*/}
          <div id="chrome_extension" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
