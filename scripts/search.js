import * as Logging from "~/common/logging";
import * as Data from "~/node_common/data";

import SearchManager from "~/node_common/managers/search";

async function manage() {
  // await SearchManager.createUserIndex();
  // await SearchManager.createSlateIndex();
  // await SearchManager.createFileIndex();
  // await SearchManager.deleteUserIndex();
  // await SearchManager.deleteSlateIndex();
  // await SearchManager.deleteFileIndex();
  // await ingestUsers();
  // await ingestSlates();
  // await ingestFiles();
}

async function ingestUsers() {
  const response = await Data.getEveryUser();
  await SearchManager.indexUser(response);
}

async function ingestSlates() {
  const response = await Data.getEverySlate();
  await SearchManager.indexSlate(response);
}

async function ingestFiles() {
  const response = await Data.getEveryFile();
  await SearchManager.indexFile(response);
}

async function update() {
  //   await SearchManager.indexUser({
  //     id: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //     username: "martina",
  //     name: "Martina Long",
  //     body:
  //       "My name is Martina. Working at @slate aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  //     photo:
  //       "https://slate.textile.io/ipfs/bafybeid7ykqgrsgmqsknpmxs25k6zbt4n5yoq72auboyyhgbmaf647wbku",
  //     followerCount: 2,
  //     slateCount: 41,
  //   });
  //
  //   await SearchManager.indexSlate({
  //     id: "0824a3cb-e839-4246-8ff4-d919919e1487",
  //     slatename: "bird-drinks",
  //     ownerId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //     isPublic: true,
  //     subscriberCount: 1,
  //     fileCount: 14,
  //     body: "drinks in cool bird cups",
  //     name: "bird drinks",
  //     preview: null,
  //   });
  //   await SearchManager.indexFile({
  //     id: "10071abd-95c5-415e-8a12-aa17e7f560cf",
  //     ownerId: "f9cc7b00-ce59-4b49-abd1-c7ef7253e258",
  //     cid: "bafybeihr3eepugleul7tyw7niwpralwrnfhpxlnafies7cuufhssnkvsqe",
  //     isPublic: true,
  //     filename: "foggy.jpeg",
  //     downloadCount: 0,
  //     saveCount: 0,
  //     url: null,
  //     isLink: false,
  //     name: "foggy.jpeg",
  //     size: 485757,
  //     type: "image/jpeg",
  //     blurhash: "UJD,Gx~WIpWVIpR.R+RjSjNHITWBR,oes:s:",
  //     tags: [
  //       { id: "d82fbc78-88de-4015-adec-a7ea832fc922", name: "martuna", slatename: "martuna" },
  //       { id: "0824a3cb-e839-4246-8ff4-d919919e1487", name: "bird drinks", slatename: "bird-drinks" },
  //     ],
  //   });
  //   await SearchManager.indexFile([
  //     {
  //       id: "10071abd-95c5-415e-8a12-aa17e7f560cf",
  //       ownerId: "f9cc7b00-ce59-4b49-abd1-c7ef7253e258",
  //       cid: "bafybeihr3eepugleul7tyw7niwpralwrnfhpxlnafies7cuufhssnkvsqe",
  //       isPublic: true,
  //       filename: "foggy.jpeg",
  //       downloadCount: 0,
  //       saveCount: 0,
  //       url: null,
  //       isLink: false,
  //       name: "foggy.jpeg",
  //       size: 485757,
  //       type: "image/jpeg",
  //       blurhash: "UJD,Gx~WIpWVIpR.R+RjSjNHITWBR,oes:s:",
  //       tags: [
  //         { id: "d82fbc78-88de-4015-adec-a7ea832fc922", name: "martuna", slatename: "martuna" },
  //         {
  //           id: "0824a3cb-e839-4246-8ff4-d919919e1487",
  //           name: "bird drinks",
  //           slatename: "bird-drinks",
  //         },
  //       ],
  //     },
  //     {
  //       id: "090ae73f-752d-4566-aacc-8d8b2008b628",
  //       ownerId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //       cid: "bafkreicqxymykq3wzpzsrgptqmesnoeuagjv42g53jbz4d37fpigux7k7i",
  //       isPublic: false,
  //       filename: "F1CCCCDE-326D-49DF-A8B4-7DD63095D656_1_105_c.jpeg",
  //       downloadCount: 0,
  //       saveCount: 0,
  //       url: null,
  //       isLink: false,
  //       name: "Pig",
  //       size: 200084,
  //       type: "image/jpeg",
  //       blurhash: null,
  //       tags: [
  //         { id: "d82fbc78-88de-4015-adec-a7ea832fc922", name: "martuna", slatename: "martuna" },
  //         {
  //           id: "0824a3cb-e839-4246-8ff4-d919919e1487",
  //           name: "bird drinks",
  //           slatename: "bird-drinks",
  //         },
  //       ],
  //     },
  //   ]);
  //   await SearchManager.updateFile([
  //     {
  //       id: "10071abd-95c5-415e-8a12-aa17e7f560cf",
  //       filename: "sunny.jpeg",
  //       name: "sunny.jpeg",
  //     },
  //     {
  //       id: "090ae73f-752d-4566-aacc-8d8b2008b628",
  //       isPublic: true,
  //     },
  //   ]);
  //   await SearchManager.deleteFile([
  //     { id: "10071abd-95c5-415e-8a12-aa17e7f560cf" },
  //     { id: "090ae73f-752d-4566-aacc-8d8b2008b628" },
  //   ]);
  //   await SearchManager.deleteUser({ id: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7" });
  //   await SearchManager.deleteSlate({ id: "0824a3cb-e839-4246-8ff4-d919919e1487" });
}

async function search() {
  let result = null;
  // result = await SearchManager.searchUser({ query: "image" });
  // result = await SearchManager.searchSlate({
  //   query: "my slate",
  //   ownerId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   userId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   globalSearch: true,
  // });
  // result = await SearchManager.searchFile({
  //   query: "slate",
  //   ownerId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   // userId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   globalSearch: true,
  //   tagIds: [],
  //   // tagIds: ["d82fbc78-88de-4015-adec-a7ea832fc922", "0824a3cb-e839-4246-8ff4-d919919e1487"],
  // });
  // result = await SearchManager.searchMultiple({
  //   query: "slate",
  //   ownerId: "02b5f36f-2ce3-46f3-8b95-9bd996658e22",
  //   userId: "5172dd8b-6b11-40d3-8c9f-b4cbaa0eb8e7",
  //   grouped: true,
  //   types: ["SLATE", "FILE"],
  // });

  // result = await SearchManager.getFile({ id: "2892b652-5034-4e0f-b3b2-0352e0d64e17" });
  console.log(result);
}

async function setUpIndex() {
  await SearchManager.createUserIndex();
  await SearchManager.createSlateIndex();
  await SearchManager.createFileIndex();
  await ingestUsers();
  await ingestSlates();
  await ingestFiles();
}

async function resetIndex() {
  await SearchManager.deleteUserIndex();
  await SearchManager.deleteSlateIndex();
  await SearchManager.deleteFileIndex();
  await setUpIndex();
}

// await setUpIndex();
await resetIndex();
// await Promise.all([manage(), update(), search()]);

Logging.log(`FINISHED: search.js`);
Logging.log(`          CTRL + C to return to terminal.`);
