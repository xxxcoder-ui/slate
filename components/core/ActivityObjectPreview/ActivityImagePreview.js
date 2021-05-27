import * as React from "react";

import { AspectRatio } from "~/components/system";
import { useInView } from "~/common/hooks";
import { Blurhash } from "react-blurhash";
import { isBlurhashValid } from "blurhash";

import ObjectPreviewPremitive from "./ObjectPreviewPremitive";

export default function ActivityImagePreview({ url, file, ...props }) {
  const previewerRef = React.useRef();
  const [isLoading, setLoading] = React.useState(true);
  const handleOnLoaded = () => setLoading(false);

  const { isInView } = useInView({
    ref: previewerRef,
  });

  const coverImage = file?.data?.coverImage;
  const blurhash = React.useMemo(() => {
    return file.data.blurhash && isBlurhashValid(file.data.blurhash)
      ? file.data.blurhash
      : coverImage?.data.blurhash && isBlurhashValid(coverImage?.data.blurhash)
      ? coverImage?.data.blurhash
      : null;
  }, [file]);

  return (
    <ObjectPreviewPremitive {...props}>
      <div
        ref={previewerRef}
        style={{
          position: "relative",
          width: "100%",
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading && blurhash && (
          <div
            style={{ position: "absolute", top: "0%", left: "0%", width: "100%", height: "100%" }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                display: "flex",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 2,
              }}
            >
              <AspectRatio ratio={186 / 302}>
                <div>
                  <Blurhash
                    hash={blurhash}
                    height="100%"
                    width="100%"
                    style={{ marginTop: "10%" }}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                  />
                </div>
              </AspectRatio>
            </div>
          </div>
        )}
        {isInView && (
          <AspectRatio ratio={186 / 302}>
            {/** NOTE(amine): if it's loaded */}
            <img
              src={url}
              style={{ objectFit: "cover", marginTop: "10%" }}
              onLoad={handleOnLoaded}
            />
          </AspectRatio>
        )}
      </div>
    </ObjectPreviewPremitive>
  );
}
