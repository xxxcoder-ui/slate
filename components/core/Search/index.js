import * as React from "react";
import * as SVG from "~/common/svg";
import * as Styles from "~/common/styles";

import { css } from "@emotion/react";
import { Input as InputPrimitive } from "~/components/system/components/Input";
import { useSearchStore } from "~/components/core/Search/store";
import { LoaderSpinner } from "~/components/system/components/Loaders";
import { FileTypeGroup } from "~/components/core/FileTypeIcon";
import { Link } from "~/components/core/Link";

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
  input {
    height: 100%;
    padding: 0px 4px;
    border-radius: 0px;
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

const useDebouncedSearch = ({ handleSearch }) => {
  const { query } = useSearchStore();

  const timeRef = React.useRef();
  React.useEffect(() => {
    timeRef.current = setTimeout(() => handleSearch(query), 300);
    return () => clearTimeout(timeRef.current);
  }, [query]);
};

function Input({ viewer, data, page, onAction }) {
  const { search, query, isFetchingResults, setQuery } = useSearchStore();

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
      console.log(data?.id, page.id, page.id === "NAV_PROFILE", data?.id !== viewer?.id);
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

  useDebouncedSearch({ handleSearch });

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <InputPrimitive
        full
        containerStyle={{ height: "100%" }}
        inputCss={STYLES_SEARCH_COMPONENT}
        name="search"
        placeholder={`Search ${!viewer ? "slate.host" : ""}`}
        onSubmit={() => handleSearch(query)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {isFetchingResults && (
        <div style={{ position: "absolute", right: 0, top: 0 }}>
          <LoaderSpinner style={{ position: "block", height: 16, width: 16 }} />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Dismiss
 * -----------------------------------------------------------------------------------------------*/

const STYLES_DISMISS_BUTTON = (theme) => css`
  display: block;
  ${Styles.BUTTON_RESET};
  color: ${theme.semantic.textGray};
`;

function Dismiss({ css, ...props }) {
  const { clearSearch } = useSearchStore();

  return (
    <button onClick={clearSearch} css={[STYLES_DISMISS_BUTTON, css]} {...props}>
      <SVG.Dismiss style={{ display: "block" }} height={16} width={16} />
    </button>
  );
}

/* -------------------------------------------------------------------------------------------------
 *  Content
 * -----------------------------------------------------------------------------------------------*/

function Content({ onAction, viewer, page }) {
  const { results } = useSearchStore();
  const { files, slates } = results;

  if (results.files.length === 0 && results.slates.length === 0) {
    return (
      <div css={Styles.PAGE_CONTENT_WRAPPER}>
        <EmptyState>
          <FileTypeGroup />
          <div style={{ marginTop: 24 }}>Sorry we couldn&apos;t find any results.</div>
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
