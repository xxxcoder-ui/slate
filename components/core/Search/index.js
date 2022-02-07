import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";
import * as System from "~/components/system";

import { css } from "@emotion/react";
import { Input as InputPrimitive } from "~/components/system/components/Input";
import { useSearchStore } from "~/components/core/Search/store";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { Link } from "~/components/core/Link";
import { useIsomorphicLayoutEffect } from "~/common/hooks";

import DataView from "~/components/core/DataView";
import CollectionPreviewBlock from "~/components/core/CollectionPreviewBlock";
import EmptyState from "~/components/core/EmptyState";
import omit from "lodash.omit";

/* -------------------------------------------------------------------------------------------------
 *  Input
 * -----------------------------------------------------------------------------------------------*/

const STYLES_SEARCH_COMPONENT = (theme) => css`
  background-color: transparent;
  box-shadow: none;
  height: 100%;
  border-radius: 0px;
  input {
    height: 100%;
    padding: 0px 4px;
  }
  &::placeholder {
    color: ${theme.semantic.textGray};
  }
`;

const useSearchViaParams = ({ params, handleSearch }) => {
  const { setQuery, clearSearch } = useSearchStore();

  React.useEffect(() => {
    if (params?.s) {
      setQuery(params.s);
      handleSearch(params.s);
    }
  }, []);

  // NOTE(amine): if we change
  React.useEffect(() => {
    if (!params.s) clearSearch();
  }, [params.s]);
};

const useDebouncedOnChange = ({ setQuery, handleSearch }) => {
  const timeRef = React.useRef();
  const handleChange = (e) => {
    clearTimeout(timeRef.current);
    const { value } = e.target;
    timeRef.current = setTimeout(() => (setQuery(value), handleSearch(value)), 300);
  };
  return handleChange;
};

function Input({ viewer, data, page, onAction }) {
  const { search, query, setQuery } = useSearchStore();

  const handleSearch = async (query) => {
    // NOTE(amine): update params with search query
    onAction({
      type: "UPDATE_PARAMS",
      params: query?.length > 0 ? { s: query } : omit(page.params, ["s"]),
    });

    if (!query) return;

    // NOTE(amine): searching on your own tag.
    if (page.id === "NAV_SLATE" && data?.ownerId === viewer?.id) {
      search({
        types: ["FILE"],
        tagIds: [data.id],
        query,
      });
      return;
    }

    //NOTE(amine): searching on another user's tag
    if (page.id === "NAV_SLATE" && data?.ownerId !== viewer?.id) {
      search({
        types: ["FILE"],
        tagIds: [data.id],
        query,
        globalSearch: true,
      });
      return;
    }

    //NOTE(amine): searching on another user's profile
    if (page.id === "NAV_PROFILE" && data?.id !== viewer?.id) {
      search({
        types: ["SLATE", "FILE"],
        userId: data.id,
        query,
        globalSearch: true,
        grouped: true,
      });
      return;
    }

    //NOTE(amine): searching on library
    if (viewer) {
      search({
        types: ["FILE", "SLATE"],
        query,
        grouped: true,
      });
      return;
    }

    // NOTE(amine): global search
    search({
      types: ["FILE", "SLATE", "USER"],
      globalSearch: true,
      query: query,
      grouped: true,
    });
  };

  useSearchViaParams({ params: page.params, onAction, handleSearch });

  const handleChange = useDebouncedOnChange({ setQuery, handleSearch });

  // NOTE(amine): cleanup input's value when query is empty.
  const inputRef = React.useRef();
  useIsomorphicLayoutEffect(() => {
    if (!query && inputRef.current) inputRef.current.value = "";
  }, [query]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        /**
         * NOTE(amine): Since this input takes 100% of the parent's height, the top part of the focusRing will be hidden.
         * To fix this we add a 2px margin-top. (2px is the width of the focusRing)
         *  */
        marginTop: "2px",
        height: "calc(100% - 2px)",
      }}
    >
      <InputPrimitive
        ref={inputRef}
        full
        containerStyle={{ height: "100%" }}
        inputCss={STYLES_SEARCH_COMPONENT}
        name="search"
        placeholder={`Search ${!viewer ? "slate.host" : ""}`}
        onSubmit={() => handleSearch(query)}
        onChange={handleChange}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Dismiss
 * -----------------------------------------------------------------------------------------------*/

const STYLES_DISMISS_BUTTON = (theme) => css`
  display: block;
  color: ${theme.semantic.textGray};
`;

function Dismiss({ css, ...props }) {
  const { clearSearch } = useSearchStore();

  return (
    <System.ButtonPrimitive onClick={clearSearch} css={[STYLES_DISMISS_BUTTON, css]} {...props}>
      <SVG.Dismiss style={{ display: "block" }} height={16} width={16} />
    </System.ButtonPrimitive>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Content
 * -----------------------------------------------------------------------------------------------*/

function Content({ onAction, viewer, page, isMobile }) {
  const { results } = useSearchStore();
  const { files, slates } = results;

  if (results.files.length === 0 && results.slates.length === 0) {
    return (
      <div css={Styles.PAGE_EMPTY_STATE_WRAPPER}>
        <EmptyState>
          <FileTypeGroup />
          <div style={{ marginTop: 24 }}>No results found</div>
        </EmptyState>
      </div>
    );
  }

  return (
    <div css={Styles.PAGE_CONTENT_WRAPPER}>
      <DataView
        key="scene-files-folder"
        isOwner={true}
        items={files}
        onAction={onAction}
        viewer={viewer}
        isMobile={isMobile}
        page={page}
        view="grid"
      />
      {slates.length > 0 ? (
        <div style={{ marginTop: 24 }} css={Styles.COLLECTIONS_PREVIEW_GRID}>
          {slates.map((slate) => (
            <Link key={slate.id} href={`/$/slate/${slate.id}`} onAction={onAction}>
              <CollectionPreviewBlock
                key={slate.id}
                collection={slate}
                viewer={viewer}
                // TODO(amine): use owner's info instead of viewer
                owner={viewer}
                onAction={onAction}
              />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export { Input, Dismiss, Content };
