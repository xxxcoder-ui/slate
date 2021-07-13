import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";

import { css } from "@emotion/react";
import { Input } from "~/components/system/components/Input";

const STYLES_TAG_CONTAINER = css`
  width: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;

const STYLES_INPUT_CONTAINER = css`
  width: 100%;
  position: relative;
`;

const STYLES_DROPDOWN = css`
  margin: 0;
  position: absolute;
  top: 60px;
  left: 0;
  width: 100%;
  z-index: 30;
  box-shadow: 0px 12px 24px rgba(178, 178, 178, 0.3);
  border-radius: 8px;
  overflow: hidden;
  background: ${Constants.system.white};
  border: 1px solid ${Constants.system.grayLight5};

  li[data-item-active="true"] {
    background: ${Constants.system.grayDark4};

    span,
    svg {
      color: ${Constants.system.white};
    }
  }
`;

const STYLES_DROPDOWN_DARK = css`
  ${STYLES_DROPDOWN}
  background: ${Constants.system.grayDark6};
  border: 1px solid #3c3c3c;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.2);
`;

const DROPDOWN_ITEM_STYLES = `
  list-style-type: none;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;

  span {
    font-size: 14px;
    line-height: 1.5;
    color: ${Constants.semantic.textGray};
    font-family: ${Constants.font.text};
    margin: 0 0 0 8px;
  }


  div.dismiss {
    opacity: 0;

    &:hover {
      color: ${Constants.system.black};
    }
  }
`;

const STYLES_DROPDOWN_ITEM = css`
  ${DROPDOWN_ITEM_STYLES};

  border-bottom: 1px solid ${Constants.system.grayLight5};

  &:hover {
    background: ${Constants.system.grayLight6};

    span,
    div:not(.dismiss) {
      color: ${Constants.system.black};
    }

    div.dismiss {
      opacity: 1;
    }
  }

  div.active {
    background: linear-gradient(105.04deg, #e3e3e3 7.95%, #f3f3f3 92.61%);
    border-radius: 50px;
  }
`;

const STYLES_DROPDOWN_ITEM_DARK = css`
  ${DROPDOWN_ITEM_STYLES};

  border-bottom: 1px solid #3c3c3c;

  &:hover {
    background: ${Constants.system.grayDark4};

    span,
    div:not(.dismiss) {
      color: ${Constants.system.white};
    }

    div.dismiss {
      opacity: 1;
    }
  }

  div.active {
    background: linear-gradient(90deg, rgba(134, 134, 136, 1) 0%, rgba(134, 134, 136, 0.2) 80%);
    border-radius: 50px;

    span {
      padding: 2.5px 2px;
      line-height: 1;
    }
  }

  div.false {
    span {
      line-height: 1;
    }
  }
`;

const STYLES_DROPDOWN_ITEM_ICON = css`
  line-height: 0;
  color: ${Constants.system.grayDark3};
  display: flex;
  align-items: center;

  span {
    line-height: 1;
    padding: 2.5px 2px;
  }

  span + span {
    margin: 0;
  }
`;

const DROPDOWN_ITEM_ADD_STYLES = `
  list-style-type: none;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;

  span {
    font-size: 14px;
    line-height: 1.5;
    font-family: ${Constants.font.text};
  }
`;

const STYLES_DROPDOWN_ADD_ITEM = css`
  ${DROPDOWN_ITEM_ADD_STYLES};

  ${"" /* background: ${Constants.system.white}; */}
  ${"" /* border: 0.5px solid ${Constants.system.grayLight5}; */}

  span {
    color: ${Constants.system.black};
  }

  span.value {
    background: ${Constants.semantic.bgLight};
  }

  &:hover {
    background: ${Constants.system.grayLight6};

    span.value {
      background: ${Constants.system.grayLight4};
    }
  }
`;

const STYLES_DROPDOWN_ADD_ITEM_DARK = css`
  ${DROPDOWN_ITEM_ADD_STYLES};

  ${"" /* background: ${Constants.system.grayDark6}; */}
  ${"" /* border: 0.5px solid ${Constants.semantic.bgBlurLight6}; */}

  span,
  svg {
    color: ${Constants.semantic.textGray};
  }

  span.value {
    background: ${Constants.system.grayDark3};
    color: ${Constants.system.white};
  }

  &:hover {
    background: ${Constants.system.grayDark4};

    span,
    svg {
      color: ${Constants.system.white};
    }
  }
`;

// const INPUT_STYLES = `
//   box-sizing: border-box;
//   font-family: ${Constants.font.text};
//   -webkit-appearance: none;
//   border-radius: 4px;
//   display: flex;
//   padding: 8px 12px;
//   font-size: 14px;
//   align-items: center;
//   justify-content: flex-start;
//   outline: 0;
//   border: 0;
//   box-sizing: border-box;
//   transition: 200ms ease all;
// `;

const STYLES_INPUT = css`
  ${"" /* ${INPUT_STYLES}; */}

  width: 100%;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 0 0 1px ${Constants.system.grayLight4} inset;
  background: ${Constants.system.white};
  color: ${Constants.system.black};

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${Constants.system.grayLight2};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${Constants.system.grayLight2};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${Constants.system.grayLight2};
  }
`;

const STYLES_INPUT_DARK = css`
  ${STYLES_INPUT};

  box-shadow: 0 0 0 1px #3c3c3c inset;
  background: ${Constants.semantic.bgBlurBlack};
  color: ${Constants.system.white};
`;

const STYLES_LIST = css`
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0;
  border-radius: 4px;
`;

const TAG_STYLES = `
  list-style-type: none;
  border-radius: 4px;
  font-family: ${Constants.font.text};
  padding: 2px 8px;
  margin: 8px 8px 0 0;
  cursor: pointer;

  span {
    line-height: 1.5;
    font-size: 14px;
  }
`;

const STYLES_TAG = css`
  ${TAG_STYLES};

  background: ${Constants.semantic.bgLight};
  color: ${Constants.system.black};

  &:hover {
    background: ${Constants.system.grayLight4};
  }
`;

const STYLES_TAG_DARK = css`
  ${TAG_STYLES};

  background: ${Constants.system.grayDark4};
  color: ${Constants.semantic.textGray};

  &:hover {
    background: ${Constants.system.grayDark4};
  }
`;

const STYLES_SHOW_MORE = css`
  font-family: ${Constants.font.text};
  color: ${Constants.semantic.textGray};
  font-size: 14px;
  display: flex;
  align-items: center;
  margin: 10px 0 0;
  cursor: pointer;

  span {
    margin: 0 0 0 8px;
  }
`;

const Dropdown = ({
  type,
  open,
  setOpen,
  tags,
  value,
  suggestions,
  dropdownStyles,
  handleAdd,
  handleRemove,
}) => {
  const dropdownEl = React.useRef();

  const filterTags = (suggestions) => {
    let matches = suggestions.filter((tag) => {
      const regex = new RegExp(`${value}`, "gi");
      return tag.match(regex);
    });

    return matches;
  };

  const filteredTags = filterTags(suggestions);
  const isActiveTag = (index) => tags.includes(filteredTags[index]);

  const _handleClickOutside = (e) => {
    if (dropdownEl.current.contains(e.target)) {
      return;
    }

    setOpen(false);
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", _handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", _handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownEl}>
      <ul
        css={type === "dark" ? STYLES_DROPDOWN_DARK : STYLES_DROPDOWN}
        style={{
          display: open ? "block" : "none",
          ...dropdownStyles,
        }}
      >
        {
          <>
            {(filteredTags || []).map((tag, index) => (
              <li
                key={tag}
                css={type === "dark" ? STYLES_DROPDOWN_ITEM_DARK : STYLES_DROPDOWN_ITEM}
                onClick={isActiveTag(index) ? () => handleRemove(tag) : () => handleAdd(tag)}
                data-item-active={type === "dark" && isActiveTag(index)}
              >
                {isActiveTag(index) && (
                  <div css={STYLES_DROPDOWN_ITEM_ICON}>
                    <SVG.Check height="16px" />
                  </div>
                )}
                <span>{tag}</span>
                {isActiveTag(index) && (
                  <div
                    css={STYLES_DROPDOWN_ITEM_ICON}
                    style={{ marginLeft: "auto" }}
                    className="dismiss"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(tag);
                    }}
                  >
                    <SVG.Dismiss height="16px" />
                  </div>
                )}
              </li>
            ))}
            <li
              css={type === "dark" ? STYLES_DROPDOWN_ADD_ITEM_DARK : STYLES_DROPDOWN_ADD_ITEM}
              onClick={() => {
                if (value) {
                  handleAdd(value);
                  setOpen(false);
                }
              }}
            >
              <SVG.Plus height="16px" />
              <span style={{ margin: "0 8px" }}>create new tag</span>
              {value && (
                <span
                  css={type === "dark" ? STYLES_TAG_DARK : STYLES_TAG}
                  className="value"
                  style={{ margin: 0 }}
                >
                  {value}
                </span>
              )}
            </li>
          </>
        }
      </ul>
    </div>
  );
};

export const Tag = ({
  type,
  tags = [],
  suggestions = [],
  style,
  textStyle,
  dropdownStyles,
  onChange,
  handleClick,
  containerStyle,
}) => {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [showMore, setShowMore] = React.useState(false);

  const numToDisplay = showMore ? tags.length : 15;

  const _handleRemove = (tag) => {
    const newTags = [...tags];
    const tagIndex = tags.indexOf(tag);

    newTags.splice(tagIndex, 1);

    if (onChange) {
      onChange({ target: { name: "tags", value: newTags } });
    }
  };

  const _handleAdd = (value) => {
    if ((tags || []).find((tag) => tag.toLowerCase() === value.toLowerCase().trim())) {
      return;
    }
    if (onChange) {
      onChange({ target: { name: "tags", value: [...tags, value.trim()] } });
      setValue("");
    }
  };

  const _handleChange = (e) => {
    let regex = /[^a-z\d\s]/i;
    let value = e.target.value.toLowerCase().replace(regex, "");
    setValue(value);
  };

  const _handleKeyPress = (e) => {
    if (e.key === "Enter" && value.length) {
      _handleAdd(value);
    }
    if (!open) {
      setOpen(true);
    }
  };

  const _handlePaste = (e) => {
    let regex = /[^a-z\d\s]/i;
    let value = e.clipboardData.getData("text/plain").toLowerCase();
    if (regex.test(value)) {
      e.preventDefault();
      return;
    }

    setValue(value);
  };

  const _handleFocus = () => setOpen(true);

  return (
    <div css={STYLES_TAG_CONTAINER} style={containerStyle}>
      <div css={STYLES_INPUT_CONTAINER}>
        <Input
          name="tags"
          type="text"
          // css={type === "dark" ? STYLES_INPUT_DARK : STYLES_INPUT}
          style={style}
          textStyle={textStyle}
          placeholder="Edit tags"
          value={value}
          onChange={_handleChange}
          onKeyPress={_handleKeyPress}
          onPaste={_handlePaste}
          onFocus={_handleFocus}
        />
        <Dropdown
          type={type}
          open={open}
          setOpen={setOpen}
          tags={tags}
          suggestions={suggestions}
          value={value}
          // dropdownStyles={dropdownStyles}
          handleAdd={_handleAdd}
          handleRemove={_handleRemove}
          dropdownStyles={{ top: "50px" }}
        />
      </div>

      <ul css={STYLES_LIST}>
        {tags &&
          tags.slice(0, numToDisplay).map((tag) => (
            <li
              key={tag}
              css={type === "dark" ? STYLES_TAG_DARK : STYLES_TAG}
              onClick={handleClick}
            >
              <span>{tag}</span>
            </li>
          ))}
      </ul>

      {tags?.length > 15 && (
        <p css={STYLES_SHOW_MORE} onClick={() => setShowMore(!showMore)}>
          <SVG.ChevronDown
            height="16px"
            style={{ transform: `rotate(${showMore ? 180 : 0}deg)`, transition: "200ms ease all" }}
          />

          <span>{!showMore ? "show all" : "show less"}</span>
        </p>
      )}
    </div>
  );
};
