import App from "next/app";
import ThemeProvider from "~/components/system/ThemeProvider";

import * as React from "react";

import { Global } from "@emotion/react";
import { injectGlobalStyles, injectCodeBlockStyles } from "~/common/styles/global";
import { IntercomProvider } from 'react-use-intercom';

const INTERCOM_APP_ID = 'jwgbampk';

// NOTE(wwwjim):
// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <React.Fragment>
        <Global styles={injectGlobalStyles()} />
        <Global styles={injectCodeBlockStyles()} />
        <IntercomProvider appId={INTERCOM_APP_ID} autoBoot>
          <Component {...pageProps} />
        </IntercomProvider>
      </React.Fragment>
    </ThemeProvider>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  return { ...appProps };
};

export default MyApp;
