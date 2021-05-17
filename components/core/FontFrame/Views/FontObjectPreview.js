import * as React from "react";

import { css } from "@emotion/react";
import { useFont } from "~/components/core/FontFrame/hooks";

const withView = (Component) => (props) => {
  const ref = React.useRef(null);

  const [isIntersecting, setIntersecting] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIntersecting(true);
    });

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
  ({ cid, fallback }) => {
    const { isFontLoading, error, fontName } = useFont({ cid }, [cid]);
    if (error || isFontLoading) {
      return fallback;
    }
    return (
      <div style={{ fontFamily: fontName }}>
        <div css={STYLES_LETTER}>Aa</div>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.cid === nextProps.cid
);
export default withView(FontObjectPreview);
