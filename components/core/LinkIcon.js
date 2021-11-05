import * as React from "react";
import * as SVG from "~/common/svg";

import { useImage } from "~/common/hooks";

export default function LinkIcon({ file, width = 16, height = 16, style, ...props }) {
  const { linkFavicon } = file;
  const faviconImgState = useImage({ src: linkFavicon });
  return faviconImgState.error ? (
    <SVG.ExternalLink height={16} width={16} style={style} {...props} />
  ) : (
    <img
      src={linkFavicon}
      alt="Link source logo"
      style={{ borderRadius: "4px", height, width, ...style }}
      {...props}
    />
  );
}
