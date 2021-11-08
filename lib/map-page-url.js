import { uuidToId, parsePageId } from "notion-utils";
import { includeNotionIdInUrls } from "./config";
import { getCanonicalPageId } from "./get-canonical-page-id";

// include UUIDs in page URLs during local development but not in production
// (they're nice for debugging and speed up local dev)
const uuid = !!includeNotionIdInUrls;

export const mapPageUrl =
  (site, recordMap, searchParams) =>
  (pageId = "") => {
    if (uuidToId(pageId) === site.rootNotionPageId) {
      return createUrl("/", searchParams);
    } else {
      return createUrl(
        `/${getCanonicalPageId(pageId, recordMap, { uuid })}`,
        searchParams
      );
    }
  };

export const getCanonicalPageUrl =
  (site, recordMap) =>
  (pageId = "") => {
    const pageUuid = parsePageId(pageId, { uuid: true });

    if (uuidToId(pageId) === site.rootNotionPageId) {
      return `https://${site.domain}`;
    } else {
      return `https://${site.domain}/${getCanonicalPageId(pageUuid, recordMap, {
        uuid,
      })}`;
    }
  };

function createUrl(path, searchParams) {
  return [path, searchParams.toString()].filter(Boolean).join("?");
}
