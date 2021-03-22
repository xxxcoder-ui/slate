import * as React from "react";
import * as Constants from "~/common/constants";
import * as System from "~/components/system";
import CodeBlock from "~/components/system/CodeBlock";

import { css } from "@emotion/react";

const EXAMPLE_CODE_JS = (
  key,
  slateId
) => `const response = await fetch('https://slate.host/api/v1/get-slate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // NOTE: your API key
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    // NOTE: your slate ID
    id: '${slateId}'
  }})
});

const json = await response.json();
console.log(json);`;

const EXAMPLE_RESPONSE = (key, slateId) => `{
  data: {
    id: '${slateId}',
    updated_at: '2020-07-27T09:04:53.007Z',
    created_at: '2020-07-27T09:04:53.007Z',
    published_at: '2020-07-27T09:04:53.007Z',
    slatename: 'slatename',
    // NOTE(jim)
    // This 'data' property is JSONB in our postgres database
    // so every child is customizable.
    data: {
      name: "slatename",
      public: true,
      objects: [
        {
          id: "data-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          name: "Name Example",
          ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
          title: "The Final Storage System",
          body: "You can store 4GB on Slate",
          author: "Jason Leyser",
          source: "https://google.com",
          anything: "you-want",
          // NOTE(jim)
          // When you use the API you can make these API fields anything.
          url: "https://slate.host/static/art-v2-social.png"
        }
      ],
      ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
    }
  }
}`;

const DocPage = (props) => {
  let language = props.language;
  let key = props.APIKey;
  let slateId = props.slateId;
  if (language === "javascript") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 48 }}
          label="Get slate by ID"
          description="This API request will return a specific slate. If you don't provide an ID argument the response will contain the most recently modified slate."
        />
        <CodeBlock
          children={EXAMPLE_CODE_JS(key, slateId)}
          style={{ maxWidth: "768px" }}
          language={language}
        />
        <System.DescriptionGroup
          style={{ marginTop: 48, marginBottom: 16 }}
          label="Get slate by ID: Response"
          description="This is the shape of the response. Save it locally because you can send this JSON back to our API server using the route /api/v1/update-slate to update your slate."
        />
        <CodeBlock
          children={EXAMPLE_RESPONSE(key, slateId)}
          style={{ maxWidth: "768px" }}
          language="jsx"
        />
      </React.Fragment>
    );
  }
  if (language === "python") {
    return;
  }
};

export default class APIDocsGetSlate extends React.Component {
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
