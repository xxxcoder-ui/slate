import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (key) => `const response = await fetch('https://slate.host/api/v1/get', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: '${key}',
  },
  body: JSON.stringify({ data: {
    private: false // set private = true to include private collections 
  }})
});

if (!response) {
  console.log("No response");
  return;
}

if (!response.ok) {
  console.log(response.error);
  return response.error;
}

const json = await response.json();
if (json.error) {
  console.log(json.error);
} else {
  const collections = json.slates;
  const user = json.user;
}`;

const EXAMPLE_CODE_PY = (key) => `import requests
import json as JSON

url = "https://slate.host/api/v1/get"
headers = {
    "content-type": "application/json",
    "Authorization": "${key}",
}

json = {
  "data": {
    "private": "false" # set private = true to include private collections 
  }
}

r = requests.get(url, headers=headers, json=json)

print(JSON.dumps(r.json(), indent=2))`;

const EXAMPLE_RESPONSE = `
{
  "decorator": "V1_GET",
  "slates": [
    {
      "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      "slatename": "public-example",
      "data": {
        "body": "just a public collection, nothing special",
        "name": "Public Example",
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
              "id": "fce946be-7212-4f62-a74c-adfafd8d0d15"
            }
          ],
          "fileNames": false,
          "defaultLayout": true
        },
        "objects": [
          {
            "id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            "cid": "bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a",
            "url": "https://slate.textile.io/ipfs/cid-goes-here",
            "name": "door.jpg",
            "size": 33676,
            "type": "image/jpeg",
            "title": "Door",
            "ownerId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
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
      "photo": "https://slate.textile.io/ipfs/cid-goes-here",
      "body": "A user of slate",
      "name": "Bob Smith"
    }
  }
}`;

export default class APIDocsGet extends React.Component {
  render() {
    let APIKey = this.props.APIKey;
    let language = this.props.language;

    let code = {
      javascript: EXAMPLE_CODE_JS(APIKey),
      python: EXAMPLE_CODE_PY(APIKey),
    };

    return (
      <div css={this.props.cssValue} style={this.props.style}>
        <System.DescriptionGroup
          style={{ maxWidth: 640 }}
          label="Get your data"
          description="This API request returns your user data and collections. If the request body is omitted, the request will return only your public collections by default."
        />
        <CodeBlock
          children={code}
          language={language}
          style={{ maxWidth: "820px" }}
          title="Get your data"
          multiLang="true"
          onLanguageChange={this.props.onLanguageChange}
        />
        <br />
        <CodeBlock
          children={EXAMPLE_RESPONSE}
          style={{ maxWidth: "820px" }}
          language="json"
          title="Get your data response"
        />
      </div>
    );
  }
}
