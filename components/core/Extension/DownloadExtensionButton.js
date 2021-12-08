import * as React from "react";
import * as Environment from "~/common/environment";
import * as System from "~/components/system";

import { useCheckIfExtensionIsInstalled } from "~/common/hooks";
import { css } from "@emotion/react";

const getExtensionBrowserAndLink = () => {
  const testUserAgent = (regex) => regex.test(window.navigator.userAgent);

  const isFirefox = testUserAgent(/firefox/i);
  const firefoxLink = Environment.EXTENSION_FIREFOX;
  if (isFirefox && firefoxLink) return { browser: "Firefox", link: firefoxLink };

  const isSafari = testUserAgent(/safari/i);
  const safariLink = Environment.EXTENSION_SAFARI;
  if (isSafari && safariLink) return { browser: "Safari", link: safariLink };

  return { browser: "Chrome", link: Environment.EXTENSION_CHROME };
};

const STYLES_EXTENSION_BUTTON = (theme) => css`
  padding: 0px 12px;
  min-height: 30px;
  font-family: ${theme.font.text};
`;

export default function DownloadExtensionButton({ hideIfDownloaded = true, css, ...props }) {
  const { isExtensionDownloaded } = useCheckIfExtensionIsInstalled();

  if (hideIfDownloaded && isExtensionDownloaded) return null;

  const extension = getExtensionBrowserAndLink();

  return (
    <System.ButtonPrimary
      css={[STYLES_EXTENSION_BUTTON, css]}
      onClick={() => window.open(extension.link, "_blank")}
      {...props}
    >
      Install Slate for {extension.browser}
    </System.ButtonPrimary>
  );
}
