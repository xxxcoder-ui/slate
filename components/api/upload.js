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
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: data
});

const json = await response.json();

// NOTE: the URL to your asset will be available in the JSON response.
console.log(json);`;

const EXAMPLE_CODE_PY = (key, slateId) => `import requests

url = 'https://uploads.slate.host/api/public/${slateId}'
files = {'file': open('example-file.txt', 'rb')}
headers = {'Authorization': 'Basic ${key}'}

r = requests.post(url, headers=headers, files=files)
print(r.text)`;

const DocPage = (props) => {
  let language = props.language;
  let key = props.APIKey;
  let slateId = props.slateId;
  if (language === "javascript") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 64 }}
          label="Upload to slate by Id"
          description="This API endpoint will add a file object to your slate."
        />
        <CodeBlock
          children={EXAMPLE_CODE_JS(key, slateId)}
          style={{ maxWidth: "840px" }}
          language={language}
          topBar="true"
          title="Upload to slate by Id"
        />
      </React.Fragment>
    );
  }
  if (language === "python") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 64 }}
          label="Upload to slate by Id"
          description="This API endpoint will add a file object to your slate."
        />
        <CodeBlock
          children={EXAMPLE_CODE_PY(key, slateId)}
          style={{ maxWidth: "840px" }}
          language={language}
        />
      </React.Fragment>
    );
  }
};

export default class APIDocsUploadToSlate extends React.Component {
  render() {
    return (
      <DocPage
        language={this.props.language}
        APIKey={this.props.APIKey}
        slateId={this.props.slateId}
      />
    );
  }
}
