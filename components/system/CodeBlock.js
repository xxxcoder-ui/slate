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
  width: 100%;
  display: flex;
  overflow-x: auto;

  * {
    white-space: pre-wrap;
    word-break: break-word;
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

const STYLES_CODE_BLOCK_PLAIN = css`
  box-sizing: border-box;
  font-family: ${Constants.font.code};
  background-color: ${Constants.semantic.bgLight};
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

const STYLES_TOPBAR = (theme) => css`
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
  @media (max-width: ${theme.sizes.mobile}px) {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`;

const STYLES_TOPBAR_PLAIN = css`
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
  flex-grow: 1;
  text-transform: uppercase;
  color: ${Constants.semantic.textGray};
  font-size: ${Constants.typescale.lvlN1};
  font-family: ${Constants.font.medium};
  user-select: none;
  pointer-events: none;
`;

const STYLES_LANGSWITCHER = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${Constants.semantic.textGray};
  font-size: ${Constants.typescale.lvlN1};
  margin-right: 12px;
  border: 1px solid ${Constants.system.grayDark4};
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
`;

const STYLES_LANG = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${Constants.semantic.textGray};
  border-radius: 3px;
  padding: 4px 8px;
`;

const STYLES_LANG_SELECTED = css`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${Constants.system.white};
  background: ${Constants.system.grayDark4};
  border-radius: 3px;
  padding: 4px 8px;
`;

const STYLES_COPY_BUTTON = css`
  display: flex;
  align-items: center;
  color: ${Constants.semantic.textGray};
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  position: relative;

  :hover {
    background: ${Constants.system.grayDark4};
    color: ${Constants.system.white};
  }
`;

const STYLES_HIDDEN = css`
  position: absolute;
  opacity: 0;
  pointer-events: none;
`;

const STYLES_TOOLTIP = css`
  position: absolute;
  top: 32px;
  left: 0;
  z-index: ${Constants.zindex.tooltip};
  padding: 12px;
  background-color: ${Constants.semantic.bgBlurDark6};
  border-radius: 4px;
  color: ${Constants.system.white};
  font-size: ${Constants.typescale.lvlN1};
  font-family: ${Constants.font.text};
  min-width: 88px;

  @supports ((-webkit-backdrop-filter: blur(15px)) or (backdrop-filter: blur(15px))) {
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
  }
`;

class CodeBlock extends React.Component {
  _ref = null;

  static defaultProps = {
    language: "javascript",
  };

  state = {
    copyValue: "",
    tooltip: false,
    copied: false,
  };

  _handleCopy = (value) => {
    this.setState({ copyValue: value, copied: true }, () => {
      this._ref.select();
      document.execCommand("copy");
    });
    setTimeout(() => {
      this.setState({ copied: false });
    }, 1500);
  };

  _handleSwitchLang = (lang) => {
    this.setState({ language: lang });
    this.props.onLanguageChange(lang);
  };
  render() {
    let availableLanguages = this.props.multiLang ? Object.keys(this.props.children) : 1;
    let showTopBar = this.props.title || availableLanguages.length > 1;
    let copyText = this.state.copied ? "Copied" : "Copy code";

    return (
      <React.Fragment>
        {showTopBar && (
          <div css={STYLES_TOPBAR} style={this.props.style}>
            {this.props.title && <div css={STYLES_TOPBAR_TITLE}>{this.props.title}</div>}
            {availableLanguages.length > 1 && (
              <div css={STYLES_LANGSWITCHER}>
                {availableLanguages.map((language, index) => {
                  return (
                    <div
                      key={index}
                      css={language === this.props.language ? STYLES_LANG_SELECTED : STYLES_LANG}
                      onClick={() => {
                        this._handleSwitchLang(language);
                      }}
                    >
                      {language}
                    </div>
                  );
                })}
              </div>
            )}
            <div
              css={STYLES_COPY_BUTTON}
              onClick={() =>
                this._handleCopy(
                  availableLanguages.length > 1
                    ? this.props.children[this.props.language]
                    : this.props.children
                )
              }
              onMouseEnter={() => this.setState({ tooltip: true })}
              onMouseLeave={() => this.setState({ tooltip: false })}
            >
              <SVG.CopyAndPaste height="16px" />
              {this.state.tooltip && <div css={STYLES_TOOLTIP}>{copyText}</div>}
            </div>
            <input
              css={STYLES_HIDDEN}
              ref={(c) => {
                this._ref = c;
              }}
              readOnly
              value={this.state.copyValue}
            />
          </div>
        )}
        <div css={STYLES_CODE_BLOCK} style={this.props.style}>
          <Highlight
            {...defaultProps}
            theme={customTheme}
            code={
              availableLanguages.length > 1
                ? this.props.children[this.props.language]
                : this.props.children
            }
            language={this.props.language}
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
