import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";

import { css } from "@emotion/react";

const EXAMPLE_CODE_JS_1 = (key) => `const response = await fetch('https://slate.host/api/v1/get', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    // NOTE: optional, if you want your private slates too.
    private: false
  }})
});

const json = await response.json();
console.log(json);`;

const DocPage = (props) => {
  let language = props.language;
  if (language === "javascript") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 48 }}
          label="Get all slates"
          description="This API request returns all of your public slates"
        />
        <CodeBlock
          children={EXAMPLE_CODE_JS_1(props.APIKey)}
          language={language}
          style={{ maxWidth: 768 }}
        />
      </React.Fragment>
    );
  }
  if (language === "python") {
    return;
  }
};

export default class APIDocsGet extends React.Component {


  render() {
    return <DocPage language={this.props.language} APIKey={this.props.APIKey} />;
  }
}
