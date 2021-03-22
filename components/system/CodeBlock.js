import * as React from "react";
import * as Constants from "~/common/constants";
import Highlight, { defaultProps } from "prism-react-renderer";

import { css } from "@emotion/react";

// TODO:
// Refactor to https://github.com/FormidableLabs/prism-react-renderer

const customTheme = {
  plain: {
    backgroundColor: "#2a2734",
    color: "#6f7278",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#6c6783",
      },
    },
    {
      types: ["punctuation"],
      style: {
        color: "#adadad",
      },
    },
    {
      types: ["namespace"],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ["tag", "operator", "number"],
      style: {
        color: "#e09142",
      },
    },
    {
      types: ["operator"],
      style: {
        color: "#adadad",
      },
    },
    {
      types: ["property", "function"],
      style: {
        color: "#eeebff",
      },
    },
    {
      types: ["tag-id", "selector", "atrul-id"],
      style: {
        color: "#eeebff",
      },
    },
    {
      types: ["attr-name"],
      style: {
        color: "#c4b9fe",
      },
    },
    {
      types: [
        "entity",
        "attr-value",
        "keyword",
        "control",
        "directive",
        "unit",
        "statement",
        "at-rule",
        "placeholder",
        "variable",
      ],
      style: {
        color: "#99ceff",
      },
    },
    {
      types: [
        "boolean",
        "string",
        "url",
        "regex",
      ],
      style: {
        color: "#b5ffff",
      },
    },
    {
      types: ["deleted"],
      style: {
        textDecorationLine: "line-through",
      },
    },
    {
      types: ["inserted"],
      style: {
        textDecorationLine: "underline",
      },
    },
    {
      types: ["italic"],
      style: {
        fontStyle: "italic",
      },
    },
    {
      types: ["important", "bold"],
      style: {
        fontWeight: "bold",
      },
    },
    {
      types: ["important"],
      style: {
        color: "#c4b9fe",
      },
    },
  ],
};

const STYLES_CODE_BLOCK = css`
  box-sizing: border-box;
  font-family: ${Constants.font.code};
  background-color: #1f212a;
  color: ${Constants.system.white};
  border-color: ${Constants.system.yellow};
  font-size: 12px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 24px;

  * {
    white-space: pre-wrap;
    overflow-wrap: break-word;
    ::-webkit-scrollbar {
      -webkit-appearance: none;
      width: 0;
      height: 0;
    }
  }
`;

const STYLES_LINE = css`
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const STYLES_PRE = css`
  box-sizing: border-box;
  color: #666;
  font-family: ${Constants.font.code};
  flex-shrink: 0;
  min-width: 32px;
  user-select: none;
`;

const STYLES_CODE = css`
  box-sizing: border-box;
  background-color: #1f212a;
  user-select: text;
  font-family: ${Constants.font.code};
  color: ${Constants.system.gray};
  width: 100%;
  padding-left: 16px;
`;

class CodeBlock extends React.Component {
  language = this.props.language ? this.props.language : "javascript";
  render() {
    return (
      <div css={STYLES_CODE_BLOCK} style={this.props.style}>
        <Highlight
          {...defaultProps}
          theme={customTheme}
          code={this.props.children}
          language={this.language}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <pre className={className} css={STYLES_PRE}>
              {tokens.map((line, i) => (
                <div key={i} {...getLineProps({ line, key: i })}>
                  <span>{i + 1}</span>
                  <span css={STYLES_CODE}>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token, key })} />
                    ))}
                  </span>
                </div>
              ))}
            </pre>
          )}
        </Highlight>
      </div>
    );
  }
}
export default CodeBlock;
