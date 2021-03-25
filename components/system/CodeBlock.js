import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";
import Highlight, { defaultProps } from "prism-react-renderer";

import { css } from "@emotion/react";

// TODO:
// Refactor to https://github.com/FormidableLabs/prism-react-renderer

const customTheme = {
  plain: {
    backgroundColor: "#1f212a",
    color: "#6f7278",
  },
  styles: [
    {
      types: ["comment", "prolog", "doctype", "cdata"],
      style: {
        color: "#6c6783eeebff",
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
      types: ["boolean", "string", "url", "regex"],
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
  padding: 20px 24px;

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

const STYLES_CODE_BLOCK_RESPONSE = css`
  box-sizing: border-box;
  font-family: ${Constants.font.code};
  background-color: ${Constants.system.foreground};
  color: ${Constants.system.black};
  border-color: ${Constants.system.yellow};
  font-size: 12px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 20px 24px;

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

const STYLES_CODE_BODY = css`
  color: #666;
  font-family: ${Constants.font.code};
  flex-shrink: 0;
  min-width: 32px;
  user-select: none;
`;

const STYLES_CODE = css`
  box-sizing: border-box;
  user-select: text;
  font-family: ${Constants.font.code};
  color: ${Constants.system.gray};
  width: 100%;
  flex-grow: 1;
  overflow-x: auto;
`;

const STYLES_LINE_NUMBER = css`
  text-align: right;
  flex-grow: 0;
  flex-shrink: 0;
  width: 32px;
  padding-right: 16px;
`;

const STYLES_LINE = css`
  display: flex;
  justify-content: space-between;
`;

const STYLES_TOPBAR = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 20px 16px 20px;
  background: ${Constants.system.black};
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  margin-bottom: -4px;
  box-sizing: border-box;
`;

const STYLES_TOPBAR_RESPONSE = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 12px 20px 16px 20px;
  background: ${Constants.system.green};
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
  margin-bottom: -4px;
  box-sizing: border-box;
`;

const STYLES_TOPBAR_TITLE = css`
  text-transform: uppercase;
  color: ${Constants.system.textGray};
  font-size: ${Constants.typescale.lvlN1};
  font-family: ${Constants.font.medium};
  user-select: none;
  pointer-events: none;
`;

const STYLES_LANGSWITCHER = css`
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${Constants.system.textGray};
  font-size: ${Constants.typescale.lvlN1};
  margin-right: 12px;
  border: 1px solid ${Constants.system.gray80};
  border-radius: 4px;
  cursor: pointer;
`;

const STYLES_LANG = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${Constants.system.textGray};
  border-radius: 3px;
  padding: 4px 8px;
`;

const STYLES_LANG_SELECTED = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${Constants.system.white};
  background: ${Constants.system.gray80};
  border-radius: 3px;
  padding: 4px 8px;
`;

const STYLES_COPY_BUTTON = css`
  display: flex;
  align-items: center;
  color: ${Constants.system.textGray};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;

  :hover {
    background: ${Constants.system.gray80};
    color: ${Constants.system.white};
  }
`;

const STYLES_HIDDEN = css`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

class CodeBlock extends React.Component {
  _ref = null;

  state = {
    copyValue: "",
  };

  _handleCopy = (value) => {
    this.setState({ copyValue: value }, () => {
      this._ref.select();
      document.execCommand("copy");
    });
  };
  //defaults to js
  language = this.props.language ? this.props.language : "Javascript";
  render() {
    let styleTopBar = this.props.response ? STYLES_TOPBAR_RESPONSE : STYLES_TOPBAR;
    let styleCodeBlock = this.props.response ? STYLES_CODE_BLOCK_RESPONSE : STYLES_CODE_BLOCK;
    let langswitcher = this.language && !this.props.response;
    return (
      <React.Fragment>
        {this.props.topBar && (
          <div css={STYLES_TOPBAR} style={this.props.style}>
            <div css={STYLES_TOPBAR_TITLE}>{this.props.title}</div>
            {langswitcher && (
              <div css={STYLES_LANGSWITCHER}>
                <div css={STYLES_LANG}>Python</div>
                <div css={STYLES_LANG_SELECTED}>Javascript</div>
              </div>
            )}
            <div css={STYLES_COPY_BUTTON}>
              <SVG.CopyAndPaste height="16px" />
            </div>
            {/* <input
              css={STYLES_HIDDEN}
              ref={(c) => {
                this._ref = c;
              }}
              readOnly
              value={this.state.copyValue}
            /> */}
          </div>
        )}
        <div css={STYLES_CODE_BLOCK} style={this.props.style}>
          <Highlight
            {...defaultProps}
            theme={customTheme}
            code={this.props.children}
            language={this.language}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre className={className} css={STYLES_CODE_BODY}>
                {tokens.map((line, i) => (
                  <div css={STYLES_LINE} key={i} {...getLineProps({ line, key: i })}>
                    <div css={STYLES_LINE_NUMBER}>{i + 1}</div>
                    <div css={STYLES_CODE}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token, key })} />
                      ))}
                    </div>
                  </div>
                ))}
              </pre>
            )}
          </Highlight>
        </div>
      </React.Fragment>
    );
  }
}
export default CodeBlock;
