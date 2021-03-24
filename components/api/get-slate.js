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

const EXAMPLE_CODE_PY = (key, slateId) => `
import requests
import json
url = 'https://slate.host/api/v1/get'
headers = {
  'content-type': 'application/json',
  'Authorization': 'Basic ${key}'
}
json = {'id': '${slateId}'}
r = requests.post(url, headers=headers, json=json)
print(r.text)
`;

const EXAMPLE_RESPONSE = (key, slateId) => `
{
  "decorator": "V1_GET",
  "slates": [
    {
      "id": "8eb2d471-9abf-4eae-a461-c62ebeb529b0",
      "created_at": "2021-03-24T00:51:21.007Z",
      "updated_at": "2021-03-24T02:58:21.728Z",
      "published_at": null,
      "slatename": "public-example",
      "data": {
        "body": "just a public slate, nothing special",
        "name": "public-example",
        "public": true,
        "layouts": {
          "ver": "2.0",
          "layout": [
            {
              "h": 200,
              "w": 200,
              "x": 0,
              "y": 0,
              "z": 0,
              "id": "data-fce946be-7212-4f62-a74c-adfafd8d0d15"
            }
          ],
          "fileNames": false,
          "defaultLayout": true
        },
        "objects": [
          {
            "id": "data-fce946be-7212-4f62-a74c-adfafd8d0d15",
            "cid": "bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a",
            "url": "https://slate.textile.io/ipfs/bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v355ykcgzylvsfljcv3s3a",
            "name": "4.jpg",
            "size": 33676,
            "type": "image/jpeg",
            "title": "4.jpg",
            "ownerId": "8b2bfac4-9c57-4cba-ae13-81da293fabc5",
            "blurhash": "U6BzILt700IADjWBx]oz00f6?bs:00Rj_Nt7"
          }
        ],
        "ownerId": "8b2bfac4-9c57-4cba-ae13-81da293fabc5",
        "url": "https://slate.host/devexamples/public-example"
      }
    }
  ],
  "user": {
    "username": "devexamples",
    "data": {
      "photo": "https://slate.textile.io/ipfs/bafkreiardkkfxj3ip373ee2tf6ffivjqclq7ionemt6pw55e6hv7ws5pvu"
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
          style={{ maxWidth: "840px" }}
          language={language}
        />
        <System.DescriptionGroup
          style={{ marginTop: 48, marginBottom: 16 }}
          label="Get slate by ID: Response"
          description="This is the shape of the response. Save it locally because you can send this JSON back to our API server using the route /api/v1/update-slate to update your slate."
        />
        <CodeBlock
          children={EXAMPLE_RESPONSE(key, slateId)}
          style={{ maxWidth: "840px" }}
          language="jsx"
        />
      </React.Fragment>
    );
  }
  if (language === "python") {
    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ marginTop: 48 }}
          label="Get slate by ID"
          description="This API request will return a specific slate. If you don't provide an ID argument the response will contain the most recently modified slate."
        />
        <CodeBlock
          children={EXAMPLE_CODE_PY(key, slateId)}
          style={{ maxWidth: "840px" }}
          language={language}
        />
        <System.DescriptionGroup
          style={{ marginTop: 48, marginBottom: 16 }}
          label="Get slate by ID: Response"
          description="This is the shape of the response. Save it locally because you can send this JSON back to our API server using the route /api/v1/update-slate to update your slate."
        />
        <CodeBlock
          children={EXAMPLE_RESPONSE(key, slateId)}
          style={{ maxWidth: "840px" }}
          language="jsx"
        />
      </React.Fragment>
    );
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
