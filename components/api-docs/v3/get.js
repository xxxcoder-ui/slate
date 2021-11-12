import * as React from "react";
import * as System from "~/components/system";

import CodeBlock from "~/components/system/CodeBlock";

const EXAMPLE_CODE_JS = (key) => `const response = await fetch('https://slate.host/api/v3/get', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Authorization: '${key}',
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

url = "https://slate.host/api/v3/get"
headers = {
    "content-type": "application/json",
    "Authorization": "${key}",
}

r = requests.get(url, headers=headers)

print(JSON.dumps(r.json(), indent=2))`;

const EXAMPLE_RESPONSE = `
{
  decorator: "V3_GET",
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
          name: "Door",
          size: 33676,
          type: "image/jpeg",
          blurhash: "U6BzILt700IADjWBx]oz00f6?bs:00Rj_Nt7",
        },
      ],
      ownerId: "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      body: "just a public collection, nothing special",
      name: "Public Example",
      url: "https://slate.host/devexamples/public-example",
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
        name: "Door",
        size: 33676,
        type: "image/jpeg",
        blurhash: "U6BzILt700IADjWBx]oz00f6?bs:00Rj_Nt7",
      },
    ],
    photo: "https://slate.textile.io/ipfs/cid-goes-here",
    body: "A user of slate",
    name: "Bob Smith",
  },
};
`;

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
          language="javascript"
          title="Get your data response"
        />
      </div>
    );
  }
}
