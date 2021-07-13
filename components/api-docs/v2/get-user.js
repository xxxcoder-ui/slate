import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (
  key,
  userId
) => `const response = await fetch('https://slate.host/api/v2/get-user', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    id: '${userId}' // user ID
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
  const user = json.user;
}`;

const EXAMPLE_CODE_PY = (key, userId) => `import requests
import json as JSON

url = 'https://slate.host/api/v2/get-user'
headers = {
  'content-type': 'application/json',
  'Authorization': 'Basic ${key}'
}

json = {
  "data": {
    "id": "${userId}" # user ID
  }
}

r = requests.post(url, headers=headers, json=json)`;

export default class APIDocsGetUser extends React.Component {
  render() {
    let APIKey = this.props.APIKey;
    let userId = this.props.userId;
    let language = this.props.language;

    let code = {
      javascript: EXAMPLE_CODE_JS(APIKey, userId),
      python: EXAMPLE_CODE_PY(APIKey, userId),
    };

    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ maxWidth: 640, marginTop: 48, ...this.props.style }}
          label="Get user by ID"
          description="This API request will return a specific user"
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Get user by ID"
          onLanguageChange={this.props.onLanguageChange}
          multiLang="true"
        />
      </React.Fragment>
    );
  }
}
