import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";

import { css } from "@emotion/react";

const EXAMPLE_CODE_JS = (key, slateId) => {
  return `
const SLATE_ID = "${slateId}"

const slateResponseData = getSlateById(SLATE_ID);

const slate = slateResponseData.data;
slate.data.objects[0].title = "Julie Was Here."

const response = await fetch('https://slate.host/api/v1/update-slate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: slate })
});

const json = await response.json();
console.log(json);`;
};

const EXAMPLE_CODE_PY = (key, slateId) => `# STILL BEING CODED AND TESTED`;

const DocPage = (props) => {
  let language = props.language;
  let key = props.APIKey;
  let slateId = props.slateId;
  if (language === "javascript") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 64 }}
          label="Update slate by ID"
          description="This API endpoint will allow you to update a slate by sending your current locally modified version. This API endpoint allows for full customization so be careful."
        />
        <CodeBlock
          children={EXAMPLE_CODE_JS(key, slateId)}
          style={{ maxWidth: "840px" }}
          language={language}
          topBar="true"
          title="Update slate by ID"
        />
      </React.Fragment>
    );
  }
  if (language === "python") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 64 }}
          label="Update slate by ID"
          description="This API endpoint will allow you to update a slate by sending your current locally modified version. This API endpoint allows for full customization so be careful."
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

export default class APIDocsUpdateSlate extends React.Component {
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
