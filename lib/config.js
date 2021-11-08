import { parsePageId } from "notion-utils";

export const rootNotionPageId = parsePageId(
  process.env.NEXT_PUBLIC_NOTION_DATABASE,
  {
    uuid: false,
  }
);

if (!rootNotionPageId) {
  throw new Error('Config error invalid "rootNotionPageId"');
}

// if you want to restrict pages to a single notion workspace (optional)
export const rootNotionSpaceId = parsePageId(null, { uuid: true });

// general site config
export const name = "";
export const author = "";
export const domain = "";
export const description = "";

export const isDev =
  process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

export const isServer = typeof window === "undefined";

export const port = 3000;
export const host = isDev ? `http://localhost:${port}` : `https://${domain}`;

export const apiBaseUrl = `${host}/api`;

export const api = {
  createPreviewImage: `${apiBaseUrl}/create-preview-image`,
  searchNotion: `${apiBaseUrl}/search-notion`,
};

// where it all starts -- the site's root Notion page
export const includeNotionIdInUrls = !!isDev;

export const pageUrlOverrides = cleanPageUrlMap({}, "pageUrlOverrides");

export const inversePageUrlOverrides = invertPageUrlOverrides(pageUrlOverrides);

export const pageUrlAdditions = cleanPageUrlMap({}, "pageUrlAdditions");

// Optional whether or not to enable support for LQIP preview images
// (requires a Google Firebase collection)
export const isPreviewImageSupportEnabled = false;

function cleanPageUrlMap(pageUrlMap, label) {
  return Object.keys(pageUrlMap).reduce((acc, uri) => {
    const pageId = pageUrlMap[uri];
    const uuid = parsePageId(pageId, { uuid: false });

    if (!uuid) {
      throw new Error(`Invalid ${label} page id "${pageId}"`);
    }

    if (!uri) {
      throw new Error(`Missing ${label} value for page "${pageId}"`);
    }

    if (!uri.startsWith("/")) {
      throw new Error(
        `Invalid ${label} value for page "${pageId}": value "${uri}" should be a relative URI that starts with "/"`
      );
    }

    const path = uri.slice(1);

    return {
      ...acc,
      [path]: uuid,
    };
  }, {});
}

function invertPageUrlOverrides(pageUrlOverrides) {
  return Object.keys(pageUrlOverrides).reduce((acc, uri) => {
    const pageId = pageUrlOverrides[uri];

    return {
      ...acc,
      [pageId]: uri,
    };
  }, {});
}
