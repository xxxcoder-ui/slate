import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (key, slateId) => {
  return `const response = await fetch("https://slate.host/api/v2/create-collection", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Basic ${key}", // API key
    },
    body: JSON.stringify({
      data: {
        name: "My Dog Fido",
        isPublic: true,
        body: "This is an album of my dog, Fido, a golden retriever",
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
        name: "My Dog Fido",
        isPublic: true,
        body: "This is an album of my dog, Fido, a golden retriever",
    }
  }

url = "https://slate.host/api/v2/create-collection"

r = requests.post(url, headers=headers, json=postJson)`;

export default class APIDocsCreateCollection extends React.Component {
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
          label="Create Collection"
          description="This API endpoint allows you to create a collection. All fields except name are optional."
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Create collection"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
      </div>
    );
  }
}
