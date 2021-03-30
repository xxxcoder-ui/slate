import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";

import { css } from "@emotion/react";

const EXAMPLE_CODE_JS = (key, slateId) => {
  return `const SLATE_ID = "${slateId}"

const slateResponseData = getSlateById(SLATE_ID);

const slate = slateResponseData.data;
slate.data.objects[0].title = "Julie Was Here."

const response = await fetch('https://slate.host/api/v1/update-slate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: slate })
});`;
};

const EXAMPLE_CODE_PY = (key, slateId) =>
  `import requests

headers = {
    "content-type": "application/json",
    "Authorization": "Basic ${key}",
}

json = {"id": "${slateId}"}

get_slate = requests.post(
    "https://slate.host/api/v1/get-slate", headers=headers, json=json
)

get_slate_response = get_slate.json()


slate = get_slate_response["slate"]
slate["data"]["objects"][0]["title"] = "i changed the title"
updated_data = {"data": slate}

url = "https://slate.host/api/v1/update-slate"

r = requests.post(url, headers=headers, json=updated_data)`;

export default class APIDocsUpdateSlate extends React.Component {
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
          label="Update slate by ID"
          description="This API endpoint allows you to modify a slate by saving the response from get-slate, modifying it, and sending it back. Be VERY careful modifying the data field of the JSON because it allows for full customization. If you change the wrong fields, it will break you slate when the database JSONB is updated. As a rule of thumb, if a field looks like something Slate would generate (keys, hashes, id's), don't change it."
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Update slate by ID"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
      </React.Fragment>
    );
  }
}
