import { NotionAPI } from "notion-client";
// import { getPreviewImages } from "./get-preview-images";
// import { mapNotionImageUrl } from "./map-image-url";
// import { fetchTweetAst } from "static-tweets";
// import pMap from "p-map";

export const notion = new NotionAPI({
  apiBaseUrl: process.env.NOTION_API_BASE_URL,
});

export async function getPage(pageId) {
  const recordMap = await notion.getPage(pageId);
  // const blockIds = Object.keys(recordMap.block);

  // const imageUrls = blockIds
  //   .map((blockId) => {
  //     const block = recordMap.block[blockId]?.value;

  //     if (block) {
  //       if (block.type === "image") {
  //         const source = block.properties?.source?.[0]?.[0];

  //         if (source) {
  //           return {
  //             block,
  //             url: source,
  //           };
  //         }
  //       }

  //       if (block.format?.page_cover) {
  //         const source = block.format.page_cover;

  //         return {
  //           block,
  //           url: source,
  //         };
  //       }
  //     }

  //     return null;
  //   })
  //   .filter(Boolean)
  //   .map(({ block, url }) => mapNotionImageUrl(url, block))
  //   .filter(Boolean);

  // const urls = Array.from(new Set(imageUrls));
  // const previewImageMap = await getPreviewImages(urls);
  // recordMap.preview_images = previewImageMap;

  // const tweetIds = blockIds
  //   .map((blockId) => {
  //     const block = recordMap.block[blockId]?.value;

  //     if (block) {
  //       if (block.type === "tweet") {
  //         const src = block.properties?.source?.[0]?.[0];

  //         if (src) {
  //           const id = src.split("?")[0].split("/").pop();
  //           if (id) return id;
  //         }
  //       }
  //     }

  //     return null;
  //   })
  //   .filter(Boolean);

  // const tweetAsts = await pMap(
  //   tweetIds,
  //   async (tweetId) => {
  //     try {
  //       return {
  //         tweetId,
  //         tweetAst: await fetchTweetAst(tweetId),
  //       };
  //     } catch (err) {
  //       console.error("error fetching tweet info", tweetId, err);
  //     }
  //   },
  //   {
  //     concurrency: 4,
  //   }
  // );

  // const tweetAstMap = tweetAsts.reduce((acc, { tweetId, tweetAst }) => {
  //   if (tweetAst) {
  //     return {
  //       ...acc,
  //       [tweetId]: tweetAst,
  //     };
  //   } else {
  //     return acc;
  //   }
  // }, {});

  // recordMap.tweetAstMap = tweetAstMap;

  return recordMap;
}

export async function search(params) {
  return notion.search(params);
}
