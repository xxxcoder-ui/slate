import App from "next/app";
import ThemeProvider from "~/components/system/ThemeProvider";

import * as React from "react";

import { Global } from "@emotion/react";
import {
  injectGlobalStyles,
  injectCodeBlockStyles,
  injectIntercomStyles,
} from "~/common/styles/global";
import { IntercomProvider, useIntercom } from "react-use-intercom";

const INTERCOM_APP_ID = "jwgbampk";

const CustomIntercomConfig = () => {
  const { boot } = useIntercom();
  React.useLayoutEffect(() => {
    //NOTE(amine): Don't initiate the intercom widget on the landing page
    if (typeof window !== "undefined" && window.location.pathname === "/") return;
    boot({
      alignment: "left",
      horizontalPadding: 23,
      verticalPadding: 28,
    });
  }, [boot]);

  return null;
};

// NOTE(wwwjim):
// https://nextjs.org/docs/advanced-features/custom-app
function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <React.Fragment>
        <script src="//cdn.iframe.ly/embed.js" async></script>
        <Global styles={injectGlobalStyles()} />
        <Global styles={injectIntercomStyles()} />
        <Global styles={injectCodeBlockStyles()} />
        <IntercomProvider appId={INTERCOM_APP_ID}>
          <CustomIntercomConfig />
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
