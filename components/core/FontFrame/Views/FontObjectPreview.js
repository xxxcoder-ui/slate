import * as React from "react";

import { css } from "@emotion/react";
import { useFont } from "../hooks";

const withView = (Component) => (props) => {
  const ref = React.useRef(null);

  const [isIntersecting, setIntersecting] = React.useState(false);

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) setIntersecting(true);
  });

  React.useEffect(() => {
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div ref={ref}>{isIntersecting ? <Component {...props} /> : null}</div>;
};

const STYLES_LETTER = (theme) => css`
  overflow: hidden;
  font-size: ${theme.typescale.lvl8};
  @media (max-width: ${theme.sizes.tablet}px) {
    font-size: ${theme.typescale.lvl4};
  }
  @media (max-width: ${theme.sizes.mobile}px) {
    font-size: ${theme.typescale.lvl5};
  }
`;

const FontObjectPreview = React.memo(
  ({ url, cid, fallback }) => {
    const { isFontLoading, error, fontName } = useFont({ url, name: cid }, [cid]);
    if (error) {
      return fallback;
    }
    return (
      <div style={{ fontFamily: fontName }}>
        {isFontLoading ? <div>loading</div> : <div css={STYLES_LETTER}>Aa</div>}
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.cid === nextProps.cid && prevProps.url == nextProps.url
);
export default withView(FontObjectPreview);
