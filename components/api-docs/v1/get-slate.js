import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (
  key,
  slateId
) => `const response = await fetch('https://slate.host/api/v1/get-slate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ${key}',
  },
  body: JSON.stringify({ data: {
    id: '${slateId}'
  }})
});

const json = await response.json();

if (!json) {
  console.log("No response");
} else if (json.error) {
  console.log(json.error);
} else {
  const slate = json.slate;
}`;

const EXAMPLE_CODE_PY = (key, slateId) => `import requests
import json as JSON

url = 'https://slate.host/api/v1/get'
headers = {
  'content-type': 'application/json',
  'Authorization': 'Basic ${key}'
}

json = {'id': '${slateId}'}

r = requests.post(url, headers=headers, json=json)

print(JSON.dumps(r.json(), indent=2))`;

const EXAMPLE_RESPONSE = (key, slateId) => `
{
  "decorator": "V1_GET",
  "slates": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
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
            "id": "data-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "cid": "bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a",
            "url": "https://slate.textile.io/ipfs/cid-goes-here",
            "name": "door.jpg",
            "size": 33676,
            "type": "image/jpeg",
            "title": "door.jpg",
            "ownerId": ""xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx,
            "blurhash": "U6BzILt700IADjWBx]oz00f6?bs:00Rj_Nt7"
          }
        ],
        "ownerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "url": "https://slate.host/devexamples/public-example"
      }
    }
  ],
  "user": {
    "username": "devexamples",
    "data": {
      "photo": "https://slate.textile.io/ipfs/cid-goes-here"
    }
  }
}`;

export default class APIDocsGetSlate extends React.Component {
  render() {
    let APIKey = this.props.APIKey;
    let slateId = this.props.slateId;
    let language = this.props.language;

    let code = {
      javascript: EXAMPLE_CODE_JS(APIKey, slateId),
      python: EXAMPLE_CODE_PY(APIKey, slateId),
    };

    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ maxWidth: 640, marginTop: 64 }}
          label="Get slate by ID"
          description="This API request will return a specific slate. If you don't provide an ID argument the response will contain the most recently modified slate. You can save the response locally and send this JSON back to our API server using the route /api/v1/update-slate to update your slate."
        />
        <CodeBlock
          children={code}
          style={{ maxWidth: "820px" }}
          language={language}
          title="Get slate by ID"
          onLanguageChange={this.props.onLanguageChange}
          multiLang="true"
        />
        <br />
        <CodeBlock
          children={EXAMPLE_RESPONSE(APIKey, slateId)}
          style={{ maxWidth: "820px" }}
          language="json"
          title="Get slate by ID response"
        />
      </React.Fragment>
    );
  }
}
