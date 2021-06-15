import * as React from "react";
import * as Styles from "~/common/styles";

import { AspectRatio, SVG } from "~/components/system";
import { useInView } from "~/common/hooks";
import { css } from "@emotion/react";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";

const STYLES_PREVIEW_CONTAINER = css`
  position: relative;
  width: 100%;
  height: 100%;
`;

const STYLES_VIDEO_CONTAINER = css`
  position: relative;
  width: 100%;
  height: 100%;
`;
const STYLES_VIDEO = css`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  object-fit: cover;
  filter: drop-shadow(0px 0px 32px rgba(142, 142, 147, 0.5));
  padding-left: 5px;
  padding-right: 5px;
`;

const STYLES_VIDEO_PLAYBUTTON = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: opacity 0.3s;
`;

export default function VideoObjectPreview({ url, type, ...props }) {
  const previewerRef = React.useRef();
  const { isInView } = useInView({
    ref: previewerRef,
  });
  const [isHovered, setHover] = React.useState(false);
  const videoRef = React.useRef();

  React.useLayoutEffect(() => {
    if (!isHovered || !videoRef.current) return;
    const vidElement = videoRef.current;
    vidElement.currentTime = 0;
    vidElement.play();
    const id = setInterval(() => {
      vidElement.currentTime = 0;
      vidElement.play();
    }, 3000);

    return () => {
      vidElement.pause();
      clearInterval(id);
    };
  }, [isHovered]);

  const trimmedUrl = `${url}#t=0,3`;
  return (
    <ObjectPreviewPremitive
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      type={type}
      {...props}
    >
      <div ref={previewerRef} css={[Styles.CONTAINER_CENTERED, STYLES_PREVIEW_CONTAINER]}>
        {isInView && (
          <AspectRatio ratio={148 / 238}>
            <div>
              <div css={STYLES_VIDEO_CONTAINER}>
                <video ref={videoRef} css={STYLES_VIDEO} preload="auto" muted>
                  <source src={trimmedUrl} type={type} />
                  {/** NOTE(amine): fallback if video type isn't supported (example .mov) */}
                  <source src={trimmedUrl} type="video/mp4" />
                </video>

                <div
                  css={STYLES_VIDEO_PLAYBUTTON}
                  style={{
                    opacity: isHovered ? 0 : 1,
                  }}
                >
                  <SVG.PlayButton />
                </div>
              </div>
            </div>
          </AspectRatio>
        )}
      </div>
    </ObjectPreviewPremitive>
  );
}
