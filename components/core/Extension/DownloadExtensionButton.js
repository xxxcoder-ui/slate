import * as React from "react";
import * as System from "~/components/system";
import * as Constants from "~/common/constants";

import { useCheckIfExtensionIsInstalled } from "~/common/hooks";
import { css } from "@emotion/react";

const getExtensionBrowserAndLink = () => {
  const testUserAgent = (regex) => regex.test(window.navigator.userAgent);

  const isFirefox = testUserAgent(/firefox/i);
  const firefoxLink = Constants.extensionLink.firefox;
  if (isFirefox && firefoxLink) return { browser: "Firefox", link: firefoxLink };

  const isSafari = testUserAgent(/safari/i);
  const safariLink = Constants.extensionLink.safari;
  if (isSafari && safariLink) return { browser: "Safari", link: safariLink };

  return { browser: "Chrome", link: Constants.extensionLink.chrome };
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
