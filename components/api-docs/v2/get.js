import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (key) => `const response = await fetch('https://slate.host/api/v2/get', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ${key}',
  }
});

if (!response) {
  console.log("No response");
  return;
}

const json = await response.json();
if (json.error) {
  console.log(json);
} else {
  const collections = json.collections;
  const user = json.user;
}`;

const EXAMPLE_CODE_PY = (key) => `import requests
import json as JSON

url = "https://slate.host/api/v2/get"
headers = {
    "content-type": "application/json",
    "Authorization": "Basic ${key}",
}

r = requests.get(url, headers=headers)

print(JSON.dumps(r.json(), indent=2))`;

const EXAMPLE_RESPONSE = `
{
    decorator: "V2_GET",
    slates: [
    {
        id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        slatename: "public-example",
        isPublic: true,
        objects: [
        {
            id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            cid: "bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a", // the file URL is "https://slate.textile.io/ipfs/bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a"
            filename: "door.jpg",
            ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
            data: {
              name: "Door",
              size: 33676,
              type: "image/jpeg",
              blurhash: "U6BzILt700IADjWBx]oz00f6?bs:00Rj_Nt7",
            },
        },
        ],
        ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        data: {
        body: "just a public collection, nothing special",
        name: "Public Example",
        layouts: {
            ver: "2.0",
            layout: [
            {
                h: 200,
                w: 200,
                x: 0,
                y: 0,
                z: 0,
                id: "fce946be-7212-4f62-a74c-adfafd8d0d15",
            },
            ],
            fileNames: false,
            defaultLayout: true,
        },
        url: "https://slate.host/devexamples/public-example",
        },
    },
    ],
    user: {
    username: "devexamples",
    library: [
        {
        id: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        cid: "bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a", // the file URL is "https://slate.textile.io/ipfs/bafkreibrpxcv37juaq67it2gu7xyjo5fzq7v3r55ykcgzylvsfljcv3s3a"
        filename: "door.jpg",
        ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        data: {
            name: "Door",
            size: 33676,
            type: "image/jpeg",
            blurhash: "U6BzILt700IADjWBx]oz00f6?bs:00Rj_Nt7",
        },
        },
    ],
    data: {
        photo: "https://slate.textile.io/ipfs/cid-goes-here",
        body: "A user of slate",
        name: "Bob Smith",
    },
    },
};`;

export default class APIDocsGet extends React.Component {
  render() {
    let APIKey = this.props.APIKey;
    let language = this.props.language;

    let code = {
      javascript: EXAMPLE_CODE_JS(APIKey),
      python: EXAMPLE_CODE_PY(APIKey),
    };

    return (
      <React.Fragment>
        <System.DescriptionGroup
          style={{ maxWidth: 640, marginTop: 48, ...this.props.style }}
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
          language="javascript"
          title="Get your data response"
        />
      </React.Fragment>
    );
  }
}
