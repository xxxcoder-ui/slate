import * as System from "~/components/system";
import * as Styles from "~/common/styles";
import * as Constants from "~/common/constants";

import { LoaderSpinner } from "~/components/system/components/Loaders";
import { css } from "@emotion/react";

import LinkTag from "~/components/core/Link/LinkTag";

const STYLES_IMAGE_CONTAINER = css`
  width: 100%;
  max-height: 40%;
  overflow: hidden;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
`;

export default function LinkLoading({ file }) {
  const { url, linkImage, linkName } = file;
  return (
    <div
      css={Styles.VERTICAL_CONTAINER_CENTERED}
      style={{ backgroundColor: Constants.semantic.bgLight, height: "100%" }}
    >
      <div css={STYLES_IMAGE_CONTAINER}>
        <img src={linkImage} css={Styles.IMAGE_FILL} />
      </div>
      <div css={Styles.VERTICAL_CONTAINER_CENTERED}>
        <System.H3
          style={{ marginBottom: 16, color: Constants.semantic.textBlack, textAlign: "center" }}
        >
          {linkName}
        </System.H3>
        <span style={{ marginBottom: 16 }}>
          <LinkTag
            fillWidth={true}
            url={url}
            containerStyle={{
              backgroundColor: Constants.system.blue,
              borderRadius: 8,
              padding: "8px 16px",
            }}
            style={{
              color: Constants.system.white,
            }}
          />
        </span>
        <LoaderSpinner style={{ height: 24, width: 24 }} />
      </div>
    </div>
  );
}
