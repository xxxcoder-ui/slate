import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (
  key,
  slateId
) => `const response = await fetch('https://slate.host/api/v2/get-collection', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: '${key}',
  },
  body: JSON.stringify({ data: {
    id: '${slateId}' // collection ID
  }})
});

if (!response) {
  console.log("No response");
  return;
}

const json = await response.json();
if (json.error) {
  console.log(json);
} else {
  const collection = json.collection;
}`;

const EXAMPLE_CODE_PY = (key, slateId) => `import requests
import json as JSON

url = 'https://slate.host/api/v2/get-collection'
headers = {
  'content-type': 'application/json',
  'Authorization': '${key}'
}

json = {
  "data": {
    "id": "${slateId}" # collection ID
  }
}

r = requests.post(url, headers=headers, json=json)`;

export default class APIDocsGetCollection extends React.Component {
  render() {
    let APIKey = this.props.APIKey;
    let slateId = this.props.slateId;
    let language = this.props.language;

    let code = {
      javascript: EXAMPLE_CODE_JS(APIKey, slateId),
      python: EXAMPLE_CODE_PY(APIKey, slateId),
    };

    return (
      <div css={this.props.cssValue} style={this.props.style}>
        <System.DescriptionGroup
          style={{ maxWidth: 640 }}
          label="Get collection by ID"
          description="This API request will return a specific collection. You can save the response locally and send this JSON back to our API server using the route /api/v2/update-collection to update your collection."
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Get collection by ID"
          onLanguageChange={this.props.onLanguageChange}
          multiLang="true"
        />
      </div>
    );
  }
}
