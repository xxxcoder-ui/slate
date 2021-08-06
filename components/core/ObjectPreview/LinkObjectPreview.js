import * as React from "react";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";
import * as Constants from "~/common/constants";

import { P3 } from "~/components/system/components/Typography";
import { css } from "@emotion/react";

import ObjectPreviewPrimitive from "~/components/core/ObjectPreview/ObjectPreviewPrimitive";
import LinkPlaceholder from "~/components/core/ObjectPreview/placeholders/Link";

const STYLES_SOURCE_LOGO = css`
  height: 12px;
  width: 12px;
  border-radius: 4px;
`;

const STYLES_PLACEHOLDER_CONTAINER = css`
  height: 100%;
  ${Styles.CONTAINER_CENTERED}
`;

const STYLES_TAG_CONTAINER = (theme) => css`
  color: ${theme.semantic.textGrayLight};
  svg {
    opacity: 0;
    transition: opacity 0.3s;
  }
  :hover svg {
    opacity: 1;
  }
  ${Styles.HORIZONTAL_CONTAINER_CENTERED}
`;

export default function LinkObjectPreview({ file, ratio, ...props }) {
  const {
    data: { link },
  } = file;

  const [imgState, setImgState] = React.useState({
    isLoaded: false,
    show: false,
  });

  React.useEffect(() => {
    if (!link.image) setImgState({ show: false, isLoaded: true });

    const img = new Image();
    img.src = link.image;
    img.onload = () => {
      if (img.naturalWidth < Constants.grids.object.desktop.width) {
        setImgState({ isLoaded: true, show: false });
      } else {
        setImgState({ isLoaded: true, show: true });
      }
    };
    img.onerror = () => {
      setImgState({ isLoaded: true, show: true });
    };
  }, []);

  const tag = (
    <a
      css={Styles.LINK}
      href={file.url}
      target="_blank"
      rel="noreferrer"
      style={{ position: "relative", zIndex: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div css={STYLES_TAG_CONTAINER}>
        {link.logo && (
          <img
            src={link.logo}
            alt="Link source logo"
            style={{ marginRight: 4 }}
            css={STYLES_SOURCE_LOGO}
          />
        )}
        <P3 as="small" color="textGray" nbrOflines={1}>
          {link.source}
        </P3>
        <SVG.ExternalLink height={12} width={12} style={{ marginLeft: 4 }} />
      </div>
    </a>
  );

  return (
    <ObjectPreviewPrimitive file={file} tag={tag} {...props}>
      {imgState.isLoaded &&
        (imgState.show ? (
          <img src={link.image} alt="Link preview" css={Styles.IMAGE_FILL} />
        ) : (
          <div css={STYLES_PLACEHOLDER_CONTAINER}>
            <LinkPlaceholder ratio={ratio} />
          </div>
        ))}
    </ObjectPreviewPrimitive>
  );
}
