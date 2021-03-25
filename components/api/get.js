import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";

import { css } from "@emotion/react";

const EXAMPLE_CODE_JS = (key) => `const response = await fetch('https://slate.host/api/v1/get', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    private: false
  }})
});

const json = await response.json();
console.log(json);`;

const EXAMPLE_CODE_PY = (key) => `import requests
url = 'https://slate.host/api/v1/get'
headers = {
  'content-type': 'application/json',
  'Authorization': '${key}'
  }

json = {'private': 'true'}

r = requests.post(url, headers=headers, json=json)

print(r.text)`;

const DocPage = (props) => {
  let language = props.language;
  let APIKey = props.APIKey;
  if (language === "javascript") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 64 }}
          label="Get all slates"
          description="This API request returns all of your public slates"
        />
        <CodeBlock
          children={EXAMPLE_CODE_JS(APIKey)}
          language={language}
          style={{ maxWidth: "840px" }}
          topBar="true"
          title="Get all slates"
        />
      </React.Fragment>
    );
  }

  if (language === "python") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 64 }}
          label="Get all slates"
          description="This API request returns all of your public slates"
        />
        <CodeBlock
          children={EXAMPLE_CODE_PY(APIKey)}
          language={language}
          style={{ maxWidth: "840px" }}
        />
      </React.Fragment>
    );
  }
};

export default class APIDocsGet extends React.Component {
  render() {
    return <DocPage language={this.props.language} APIKey={this.props.APIKey} />;
  }
}
