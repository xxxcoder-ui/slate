import "isomorphic-fetch";

import * as Logging from "~/common/logging";
import * as Data from "~/node_common/data";

async function updateSendgridFields() {
  let customFields = { name: "username", field_type: "Text" };
  const fieldsResponse = await fetch("https://api.sendgrid.com/v3/marketing/field_definitions", {
    method: "POST",
    headers: new Headers({
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "content-type": "application/json",
    }),
    body: JSON.stringify(customFields),
  });
  console.log(fieldsResponse);
  let json = await fieldsResponse.json();
  console.log(json);
}

async function updateSendgridContacts() {
  let contacts = await Data.getAllSendgridContacts();
  let data = { contacts };
  const response = await fetch("https://api.sendgrid.com/v3/marketing/contacts", {
    method: "PUT",
    headers: new Headers({
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
      "content-type": "application/json",
    }),
    body: JSON.stringify(data),
  });
  console.log(response);
  let json = await response.json();
  console.log(json);
}
