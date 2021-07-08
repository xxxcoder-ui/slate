import * as React from "react";
import * as Constants from "~/common/constants";
import * as Strings from "~/common/strings";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";

const LINK_STYLES = `
  font-family: ${Constants.font.text};
  font-weight: 400;
  text-decoration: none;
  color: ${Constants.system.moonstone};
  cursor: pointer;
  transition: 200ms ease color;

  :hover {
    color: ${Constants.system.slate};
  }
`;

const useColorProp = (color) =>
  React.useMemo(
    () => (theme) => {
      if (!color) return;
      if (!(color in theme.system)) {
        console.warn(`${color} doesn't exist in our design system`);
        return;
      }
      return css({ color: theme.system[color] });
    },
    [color]
  );

const truncateElements = (nbrOfLines) =>
  nbrOfLines &&
  css`
    overflow: hidden;
    line-height: 1.5;
    word-break: break-all;
    text-overflow: ellipsis;
    -webkit-line-clamp: ${nbrOfLines};
    display: -webkit-box;
    -webkit-box-orient: vertical;
  `;

const STYLES_LINK = css`
  ${LINK_STYLES}
`;

const STYLES_LINK_DARK = css`
  color: ${Constants.system.darkGray};

  :hover {
    color: ${Constants.system.white};
  }
`;

const ANCHOR = `
  a {
    ${LINK_STYLES}
  }
`;

const onDeepLink = async (object) => {
  let slug = object.deeplink
    .split("/")
    .map((string) => Strings.createSlug(string, ""))
    .join("/");
  //TODO(martina): moved this cleanup here rather than when entering the info b/c it doesn't allow you to enter "-"'s if used during input. Switch to a dropdown / search later
  if (!object.deeplink.startsWith("/")) {
    slug = "/" + slug;
  }
  return window.open(slug);
};

const outboundRE = /^[a-z]+:/i;
const isExternal = (path) => outboundRE.test(path);

export const Link = ({ href, children, dark }) => {
  // setup default linkProps
  const linkProps = {
    href,
    target: isExternal(href) ? "_blank" : "_self",
    rel: isExternal(href) ? "external nofollow" : "",
    css: dark ? STYLES_LINK_DARK : STYLES_LINK,
  };

  // process all types of Slate links
  switch (href.charAt(0)) {
    case "@": {
      // mention links
      const mention = href.substr(1).toLowerCase();
      linkProps.href = `/${mention}`;
      break;
    }
    case "#": {
      // hash deepLinks
      // TODO: disabled in Markdown for now
      const tag = href.substr(1).toLowerCase();
      linkProps.href = `/${tag}`;
      linkProps.onClick = (e) => {
        e.preventDefault();
        onDeepLink({ deeplink: tag });
      };
      break;
    }
    default: {
    }
  }
  return <a {...linkProps}>{children}</a>;
};

const STYLES_H1 = css`
  box-sizing: border-box;
  color: inherit;
  text-decoration: none;
  display: block;
  overflow-wrap: break-word;
  ${Styles.HEADING_01};
  @media (max-width: ${Constants.sizes.mobile}px) {
    ${Styles.HEADING_03}
  }

  :hover {
    color: inherit;
  }

  :visited {
    color: inherit;
  }

  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

export const H1 = ({ nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(() => truncateElements(nbrOflines), [nbrOflines]);
  const COLOR_STYLES = useColorProp(color);
  return (
    <h1 css={[STYLES_H1, TRUNCATE_STYLE, COLOR_STYLES]} {...props}>
      {children}
    </h1>
  );
};

const STYLES_H2 = css`
  box-sizing: border-box;
  overflow-wrap: break-word;
  color: inherit;
  text-decoration: none;
  display: block;

  ${Styles.HEADING_02};
  @media (max-width: ${Constants.sizes.mobile}px) {
    ${Styles.HEADING_04}
  }

  :hover {
    color: inherit;
  }

  :visited {
    color: inherit;
  }

  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

export const H2 = ({ nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(() => truncateElements(nbrOflines), [nbrOflines]);
  const COLOR_STYLES = useColorProp(color);
  return (
    <h2 css={[STYLES_H2, TRUNCATE_STYLE, COLOR_STYLES]} {...props}>
      {children}
    </h2>
  );
};

const STYLES_H3 = css`
  box-sizing: border-box;
  overflow-wrap: break-word;
  color: inherit;
  text-decoration: none;
  display: block;

  ${Styles.HEADING_03};
  @media (max-width: ${Constants.sizes.mobile}px) {
    ${Styles.HEADING_04}
  }

  :hover {
    color: inherit;
  }

  :visited {
    color: inherit;
  }

  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

export const H3 = ({ nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(() => truncateElements(nbrOflines), [nbrOflines]);
  const COLOR_STYLES = useColorProp(color);
  return (
    <h3 css={[STYLES_H3, TRUNCATE_STYLE, COLOR_STYLES]} {...props}>
      {children}
    </h3>
  );
};

const STYLES_H4 = css`
  box-sizing: border-box;
  overflow-wrap: break-word;
  color: inherit;
  text-decoration: none;
  display: block;

  ${Styles.HEADING_04};
  @media (max-width: ${Constants.sizes.mobile}px) {
    ${Styles.HEADING_05}
  }

  :hover {
    color: inherit;
  }

  :visited {
    color: inherit;
  }

  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

export const H4 = ({ nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(() => truncateElements(nbrOflines), [nbrOflines]);
  const COLOR_STYLES = useColorProp(color);
  return (
    <h4 css={[STYLES_H4, TRUNCATE_STYLE, COLOR_STYLES]} {...props}>
      {children}
    </h4>
  );
};

const STYLES_H5 = css`
  box-sizing: border-box;
  overflow-wrap: break-word;
  color: inherit;
  text-decoration: none;
  display: block;

  ${Styles.HEADING_05};
  @media (max-width: ${Constants.sizes.mobile}px) {
    ${Styles.HEADING_05}
  }

  :hover {
    color: inherit;
  }

  :visited {
    color: inherit;
  }

  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

export const H5 = ({ nbrOflines, children, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(() => truncateElements(nbrOflines), [nbrOflines]);
  const COLOR_STYLES = useColorProp(color);
  return (
    <h5 css={[STYLES_H5, TRUNCATE_STYLE, COLOR_STYLES]} {...props}>
      {children}
    </h5>
  );
};

const STYLES_P = css`
  box-sizing: border-box;
  overflow-wrap: break-word;

  strong,
  b {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

const constructResponsiveStyle = ([desktop, mobile]) => css`
  ${desktop};
  @media (max-width: ${Constants.sizes.mobile}px) {
    ${mobile}
  }
`;
const variants = {
  "para-01": constructResponsiveStyle([Styles.PARA_01, Styles.PARA_02]),
  "para-02": constructResponsiveStyle([Styles.PARA_02, Styles.PARA_03]),
  "para-03": Styles.PARA_03,
};

export const P = ({ variant = "para-01", nbrOflines, color, ...props }) => {
  const TRUNCATE_STYLE = React.useMemo(() => truncateElements(nbrOflines), [nbrOflines]);
  const COLOR_STYLES = useColorProp(color);
  return <div css={[STYLES_P, variants[variant], TRUNCATE_STYLE, COLOR_STYLES]} {...props} />;
};

const STYLES_UL = css`
  box-sizing: border-box;
  padding-left: 24px;
`;

export const UL = (props) => {
  return <ul css={STYLES_UL} {...props} />;
};

const STYLES_OL = css`
  box-sizing: border-box;
  padding-left: 24px;
`;

export const OL = (props) => {
  return <ol css={STYLES_OL} {...props} />;
};

const STYLES_LI = css`
  box-sizing: border-box;
  margin-top: 12px;

  strong {
    font-family: ${Constants.font.semiBold};
    font-weight: 400;
  }

  ${ANCHOR}
`;

export const LI = (props) => {
  return <li css={STYLES_LI} {...props} />;
};
