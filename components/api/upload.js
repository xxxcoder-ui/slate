import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";

import { css } from "@emotion/react";

const EXAMPLE_CODE_JS = (
  key,
  slateId
) => `const url = 'https://uploads.slate.host/api/public/${slateId}';

let file = e.target.files[0];
let data = new FormData();
data.append("data", file);

const response = await fetch(url, {
  method: 'POST',
  headers: {
    Authorization: 'Basic ${key}',
  },
  body: data
});`;

const EXAMPLE_CODE_PY = (key, slateId) => `url = "https://uploads.slate.host/api/public/${slateId}"
files = {"file": open("example-file.txt", "rb")}
headers = {"Authorization": "Basic ${key}"}

r = requests.post(url, headers=headers, files=files)`;

export default class APIDocsUploadToSlate extends React.Component {
  render() {
    let language = this.props.language;
    let key = this.props.APIKey;
    let slateId = this.props.slateId;

    let code = {
      javascript: EXAMPLE_CODE_JS(key, slateId),
      python: EXAMPLE_CODE_PY(key, slateId),
    };
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ maxWidth: 640, marginTop: 64 }}
          label="Upload to slate by Id"
          description={
            'This API endpoint allows you to upload file(s) to your slate. This uses our data transfer microservice to interact with Textile Buckets and upload data to the IPFS/Filecoin network.'
          }
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Upload to slate by ID"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
      </React.Fragment>
    );
  }
}
