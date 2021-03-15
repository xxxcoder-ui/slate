import * as React from "react";
import * as Constants from "~/common/constants";
import * as SVG from "~/common/svg";

import { LoaderSpinner } from "~/components/system/components/Loaders";
import { css } from "@emotion/react";

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
  top: 33px;
  left: 0;
  width: 100%;
  z-index: 30;
  box-shadow: 0px 12px 24px rgba(178, 178, 178, 0.3);
`;

const STYLES_DROPDOWN_ITEM = css`
  list-style-type: none;
  padding: 8px 12px;
  background: ${Constants.system.white};
  border: 0.5px solid ${Constants.system.gray20};
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background: ${Constants.system.gray10};

    span,
    div:not(.dismiss) {
      color: ${Constants.system.newBlack};
    }

    div.dismiss {
      opacity: 1;
    }
  }

  span {
    font-size: 14px;
    line-height: 1.5;
    color: ${Constants.system.textGray};
    font-family: ${Constants.font.text};
    margin: 0 0 0 8px;
  }

  div.dismiss {
    opacity: 0;

    &:hover {
      color: ${Constants.system.newBlack};
    }
  }

  div.active {
    background: linear-gradient(105.04deg, #e3e3e3 7.95%, #f3f3f3 92.61%);
    border-radius: 50px;
  }
`;

const STYLES_DROPDOWN_ITEM_ICON = css`
  line-height: 0;
  color: ${Constants.system.gray70};
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

const STYLES_DROPDOWN_ADD_ITEM = css`
  list-style-type: none;
  padding: 8px 12px;
  background: ${Constants.system.white};
  border: 0.5px solid ${Constants.system.gray20};
  cursor: pointer;
  display: flex;
  align-items: center;

  span {
    font-size: 14px;
    line-height: 1.5;
    color: ${Constants.system.newBlack};
    font-family: ${Constants.font.text};
  }

  span.value {
    background: ${Constants.system.bgGray};
  }

  &:hover {
    background: ${Constants.system.gray10};

    span.value {
      background: ${Constants.system.gray30};
    }
  }
`;

const INPUT_STYLES = `
  box-sizing: border-box;
  font-family: ${Constants.font.text};
  -webkit-appearance: none;
  background: ${Constants.system.white};
  color: ${Constants.system.black};
  border-radius: 4px;
  display: flex;
  font-size: 14px;
  align-items: center;
  justify-content: flex-start;
  outline: 0;
  border: 0;
  box-sizing: border-box;
  transition: 200ms ease all;
`;

const STYLES_INPUT = css`
  ${INPUT_STYLES};

  width: 100%;
  padding: 8px 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-shadow: 0 0 0 1px ${Constants.system.gray30} inset;

  :focus {
    outline: 0;
    border: 0;
    box-shadow: 0 0 0 1px ${Constants.system.bgBlue} inset;
  }

  ::placeholder {
    /* Chrome, Firefox, Opera, Safari 10.1+ */
    color: ${Constants.system.darkGray};
    opacity: 1; /* Firefox */
  }

  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: ${Constants.system.darkGray};
  }

  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: ${Constants.system.darkGray};
  }
`;

const STYLES_LIST = css`
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0;
  border-radius: 4px;
`;

const STYLES_TAG = css`
  list-style-type: none;
  border-radius: 4px;
  background: ${Constants.system.bgGray};
  color: ${Constants.system.newBlack};
  font-family: ${Constants.font.text};
  padding: 2px 8px;
  margin: 8px 8px 0 0;

  span {
    line-height: 1.5;
    font-size: 14px;
  }

  &:hover {
    background: ${Constants.system.gray30};
  }
`;

const DeleteConfirmation = ({ tag, handleDelete }) => {
  const [deleteConfirmed, setDeleteConfirmation] = React.useState(false);

  return (
    <div
      css={STYLES_DROPDOWN_ITEM_ICON}
      style={{
        marginLeft: "auto",
      }}
      className={`dismiss ${deleteConfirmed && "active"}`}
      onMouseLeave={() => setDeleteConfirmation(false)}
    >
      {deleteConfirmed ? (
        <>
          <span
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(tag);
            }}
          >
            <SVG.Trash height="16px" />
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setDeleteConfirmation(false);
            }}
          >
            <SVG.Dismiss height="16px" />
          </span>
        </>
      ) : (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setDeleteConfirmation(true);
          }}
        >
          <SVG.Trash height="16px" />
        </span>
      )}
    </div>
  );
};

const Dropdown = ({
  open,
  setOpen,
  tags,
  value,
  suggestions,
  handleAdd,
  handleRemove,
  handleTagDelete,
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
      <ul css={STYLES_DROPDOWN} style={{ display: open ? "block" : "none" }}>
        {!suggestions.length ? (
          <li css={STYLES_DROPDOWN_ITEM}>
            <LoaderSpinner style={{ height: "24px", width: "24px", margin: "0 auto" }} />
          </li>
        ) : (
          <>
            {(filteredTags || []).map((tag, index) => (
              <li
                key={tag}
                css={STYLES_DROPDOWN_ITEM}
                onClick={isActiveTag(index) ? () => handleRemove(tag) : () => handleAdd(tag)}
              >
                {isActiveTag(index) && (
                  <div css={STYLES_DROPDOWN_ITEM_ICON}>
                    <SVG.Check height="16px" />
                  </div>
                )}
                <span>{tag}</span>
                {isActiveTag(index) ? (
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
                ) : (
                  <DeleteConfirmation tag={tag} handleDelete={handleTagDelete} />
                )}
              </li>
            ))}
            <li
              css={STYLES_DROPDOWN_ADD_ITEM}
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
                <span css={STYLES_TAG} className="value" style={{ margin: 0 }}>
                  {value}
                </span>
              )}
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export const Tag = ({
  name,
  tags,
  suggestions = [],
  style,
  placeholder,
  handleTagDelete,
  onChange,
}) => {
  const [value, setValue] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const _handleRemove = (tag) => {
    const newTags = [...tags];
    const tagIndex = tags.indexOf(tag);

    newTags.splice(tagIndex, 1);

    if (onChange) {
      onChange({ target: { name: "tags", value: newTags } });
    }
  };

  const _handleAdd = (value) => {
    if ((tags || []).find((tag) => tag.toLowerCase() === value.toLowerCase())) {
      return;
    }

    if (onChange) {
      onChange({ target: { name: "tags", value: [...tags, value] } });

      setValue("");
    }
  };

  const _handleChange = (e) => setValue(e.target.value.toLowerCase());

  const _handleFocus = () => setOpen(true);

  return (
    <div css={STYLES_TAG_CONTAINER} style={{ ...style }}>
      <div css={STYLES_INPUT_CONTAINER}>
        <input
          name={name}
          type="text"
          css={STYLES_INPUT}
          placeholder={placeholder ? placeholder : null}
          value={value}
          onChange={_handleChange}
          onFocus={_handleFocus}
        />
        <Dropdown
          open={open}
          setOpen={setOpen}
          tags={tags}
          suggestions={suggestions}
          value={value}
          handleAdd={_handleAdd}
          handleRemove={_handleRemove}
          handleTagDelete={handleTagDelete}
        />
      </div>

      <ul css={STYLES_LIST}>
        {tags &&
          tags.map((tag) => (
            <li key={tag} css={STYLES_TAG}>
              <span>{tag}</span>
            </li>
          ))}
      </ul>
    </div>
  );
};
