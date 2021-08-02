import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (
  key
) => `const url = 'https://uploads.slate.host/api/v2/public/upload-by-cid';

const response = await fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': "application/json",
    Authorization: '${key}', // API key
  },
  body: JSON.stringify({
    data: {
      cid: "FILE-CID-HERE",
      filename: "OPTIONAL-FILENAME-HERE", // if no filename is provided, filename defaults to the cid
    },
  }),
});

const json = await response.json();`;

const EXAMPLE_CODE_PY = (key) => `import requests

url = "https://uploads.slate.host/api/v2/public/upload-by-cid"

headers = {
  "Content-Type": "application/json",
  "Authorization": "${key}" # API key
}
json = {
  data: {
    cid: "FILE-CID-HERE",
    filename: "OPTIONAL-FILENAME-HERE", # if no filename is provided, filename defaults to the cid
  }
}

r = requests.post(url, headers=headers, json=json)`;

export default class APIDocsUploadByCID extends React.Component {
  render() {
    let language = this.props.language;
    let key = this.props.APIKey;
    let slateId = this.props.slateId;

    let uploadCode = {
      javascript: EXAMPLE_CODE_JS(key),
      python: EXAMPLE_CODE_PY(key),
    };
    return (
      <div css={this.props.cssValue} style={this.props.style}>
        <System.DescriptionGroup
          style={{ maxWidth: 640 }}
          label="Upload File by CID"
          description={
            "This API endpoint allows you to upload a file that already exists on the IPFS network to Slate using its CID."
          }
        />
        <CodeBlock
          children={uploadCode}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Upload File by URL"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
      </div>
    );
  }
}
