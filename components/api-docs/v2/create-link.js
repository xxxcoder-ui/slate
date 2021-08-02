import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (key, slateId) => {
  return `const response = await fetch("https://slate.host/api/v2/create-link", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic ${key}", // API key
    },
    body: JSON.stringify({
      data: {
        url: "https://google.com",
        slate: { id: "${slateId}" }, // Optional slate ID
      },
    }),
  });`;
};

const EXAMPLE_CODE_PY = (key, slateId) =>
  `import requests

headers = {
    "content-type": "application/json",
    "Authorization": "Basic ${key}", # API key
}

postJson = {
    data: {
      url: "https://google.com",
      slate: { id: "${slateId}" }, # Optional slate ID
    },
  }

url = "https://slate.host/api/v2/create-link"

r = requests.post(url, headers=headers, json=postJson)`;

export default class APIDocsCreateLink extends React.Component {
  render() {
    let language = this.props.language;
    let key = this.props.APIKey;
    let slateId = this.props.slateId;

    let code = {
      javascript: EXAMPLE_CODE_JS(key, slateId),
      python: EXAMPLE_CODE_PY(key, slateId),
    };
    return (
      <div css={this.props.cssValue} style={this.props.style}>
        <System.DescriptionGroup
          style={{ maxWidth: 640 }}
          label="Create link"
          description="This API endpoint allows you to upload a link and optionally add it to a slate. Include a slate id to add it to a slate."
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Create link"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
      </div>
    );
  }
}
