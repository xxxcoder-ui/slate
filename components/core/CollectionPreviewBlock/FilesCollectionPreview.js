import * as React from "react";
import * as Strings from "~/common/strings";
import * as Typography from "~/components/system/components/Typography";
import * as Styles from "~/common/styles";
import * as SVG from "~/common/svg";

import { Divider } from "~/components/system/components/Divider";
import { Logo } from "~/common/logo";
import { css } from "@emotion/react";
import { LikeButton, SaveButton } from "~/components/core/ObjectPreview/components";

import ObjectPlaceholder from "~/components/core/ObjectPreview/placeholders";

const STYLES_CONTAINER = (theme) => css`
  display: flex;
  flex-direction: column;
  position: relative;
  border-radius: 8px;
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${theme.system.white};
  height: 311px;
  @media (max-width: ${theme.sizes.mobile}px) {
    height: 281px;
  }
`;

const STYLES_DESCRIPTION_CONTAINER = (theme) => css`
  display: flex;
  flex-direction: column;
  position: relative;
  padding: 12px 16px;
  border-radius: 0px 0px 8px 8px;
  background-color: ${theme.system.white};
  @supports ((-webkit-backdrop-filter: blur(75px)) or (backdrop-filter: blur(75px))) {
    background-color: ${theme.system.bgGrayLight};
    -webkit-backdrop-filter: blur(75px);
    backdrop-filter: blur(75px);
  }
  width: 100%;
  margin-top: auto;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 12px;
  }
`;

const STYLES_SPACE_BETWEEN = css`
  justify-content: space-between;
`;

const STYLES_CONTROLLS = css`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const STYLES_TEXT_BLACK = (theme) => css`
  color: ${theme.system.textBlack};
`;

const STYLES_PROFILE_IMAGE = (theme) => css`
  background-color: ${theme.system.foreground};
  height: 20px;
  width: 20px;
  border-radius: 4px;
  object-fit: cover;
`;

const STYLES_HIGHLIGHT_BUTTON = (theme) => css`
  box-sizing: border-box;
  display: block;
  padding: 4px 16px;
  border: none;
  background-color: unset;
  div {
    width: 8px;
    height: 8px;
    background-color: ${theme.system.gray};
    border-radius: 50%;
  }
`;

const STYLES_METRICS = (theme) => css`
  margin-top: 16px;
  @media (max-width: ${theme.sizes.mobile}px) {
    margin-top: 12px;
  }
  ${Styles.CONTAINER_CENTERED};
  ${STYLES_SPACE_BETWEEN};
`;

const STYLES_FILES_PREVIEWS = (theme) => css`
  flex-grow: 1;
  padding: 16px;
  padding-right: 0px;
  @media (max-width: ${theme.sizes.mobile}px) {
    padding: 12px;
    padding-right: 0px;
  }
`;

const STYLES_PLACEHOLDER = css`
  height: 64px;
  min-width: 86px;
  width: 86px;
`;

const CollectionPreviewFile = ({ file }) => {
  const title = file.data.name || file.filename;
  const { body } = file.data;

  const likeCount = file.likeCount || 0;
  const saveCount = file.saveCount || 0;

  return (
    <div css={[Styles.HORIZONTAL_CONTAINER]}>
      <ObjectPlaceholder ratio={1.1} file={file} containerCss={STYLES_PLACEHOLDER} showTag />
      <div style={{ marginLeft: 16 }} css={Styles.VERTICAL_CONTAINER}>
        <Typography.H5 color="textBlack" nbrOflines={1}>
          {title}
        </Typography.H5>
        <Typography.P variant="para-03" nbrOflines={1} color="textGrayDark">
          {body}
        </Typography.P>
        <div style={{ marginTop: "auto" }} css={Styles.HORIZONTAL_CONTAINER}>
          <div css={Styles.CONTAINER_CENTERED}>
            <LikeButton />
            <Typography.P style={{ marginLeft: 8 }} variant="para-01" color="textGrayDark">
              {likeCount}
            </Typography.P>
          </div>
          <div style={{ marginLeft: 48 }} css={Styles.CONTAINER_CENTERED}>
            <SaveButton />
            <Typography.P style={{ marginLeft: 8 }} variant="para-01" color="textGrayDark">
              {saveCount}
            </Typography.P>
          </div>
        </div>
      </div>
    </div>
  );
};

const useCollectionCarrousel = ({ objects }) => {
  const [selectedIdx, setSelectedIdx] = React.useState(0);
  const selectBatchIdx = (idx) => setSelectedIdx(idx);
  const selectedBatch = objects[selectedIdx];
  return { selectBatchIdx, selectedBatch, selectedIdx };
};

export default function CollectionPreview({ collection }) {
  const filePreviews = React.useMemo(() => {
    const files = collection?.objects || [];
    let previews = [];
    for (let i = 0; i < files.length; i++) {
      const batch = [];
      if (files[i * 2]) batch.push(files[i * 2]);
      if (files[i * 2 + 1]) batch.push(files[i * 2 + 1]);
      if (batch.length > 0) previews.push(batch);
      if (previews.length === 3 || batch.length < 2) break;
    }
    return previews;
  }, [collection]);

  const { selectBatchIdx, selectedBatch, selectedIdx } = useCollectionCarrousel({
    objects: filePreviews,
  });

  const nbrOfFiles = collection?.objects?.length || 0;
  const isCollectionEmpty = nbrOfFiles === 0;

  return (
    <div css={STYLES_CONTAINER}>
      <div css={STYLES_FILES_PREVIEWS} style={{ display: "flex" }}>
        <div style={{ width: "100%" }}>
          {!isCollectionEmpty ? (
            selectedBatch.map((file, i) => (
              <React.Fragment key={file.id}>
                {i === 1 && <Divider color="bgLight" style={{ margin: "8px 0px" }} />}
                <CollectionPreviewFile file={file} />
              </React.Fragment>
            ))
          ) : (
            <div
              style={{ height: "100%" }}
              css={[Styles.CONTAINER_CENTERED, Styles.VERTICAL_CONTAINER]}
            >
              <Logo style={{ height: 18, marginBottom: 8 }} />
              <Typography.P color="textGrayDark">No files in this collection</Typography.P>
            </div>
          )}
        </div>
        {
          <div css={STYLES_CONTROLLS}>
            {filePreviews.map((preview, i) => (
              <button
                key={i}
                css={[Styles.HOVERABLE, STYLES_HIGHLIGHT_BUTTON]}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  selectBatchIdx(i);
                }}
                aria-label="Next Preview Image"
              >
                <div style={{ opacity: i === selectedIdx ? 1 : 0.3 }} />
              </button>
            ))}
          </div>
        }
      </div>
      <div css={STYLES_DESCRIPTION_CONTAINER}>
        <div>
          <div css={[Styles.HORIZONTAL_CONTAINER_CENTERED, STYLES_SPACE_BETWEEN]}>
            <Typography.H4 css={[Styles.HEADING_04, STYLES_TEXT_BLACK]}>
              {collection.slatename}
            </Typography.H4>
            <Typography.P variant="para-02" color="textGrayDark">
              {nbrOfFiles} {Strings.pluralize("Object", nbrOfFiles)}
            </Typography.P>
          </div>

          {collection?.data?.body && (
            <Typography.P
              style={{ marginTop: 4 }}
              variant="para-02"
              nbrOflines={2}
              color="textGrayDark"
            >
              {collection?.data?.body}
            </Typography.P>
          )}
        </div>

        <div css={[STYLES_METRICS]}>
          <div css={Styles.CONTAINER_CENTERED}>
            <SVG.RSS width={20} height={20} />
            <Typography.P style={{ marginLeft: 8 }} variant="para-01" color="textGrayDark">
              {collection?.subscriberCount}
            </Typography.P>
          </div>
          <div css={Styles.CONTAINER_CENTERED}>
            <img
              css={STYLES_PROFILE_IMAGE}
              src="https://slate.textile.io/ipfs/bafkreick3nscgixwfpq736forz7kzxvvhuej6kszevpsgmcubyhsx2pf7i"
              alt="owner profile"
            />
            <Typography.P style={{ marginLeft: 8 }} variant="para-02" color="textGrayDark">
              Wes Anderson
            </Typography.P>
          </div>
        </div>
      </div>
    </div>
  );
}
