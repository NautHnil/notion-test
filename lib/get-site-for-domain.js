import * as config from "./config";

export const getSiteForDomain = async (domain) => {
  return {
    domain,
    name: config.name,
    rootNotionPageId: config.rootNotionPageId,
    rootNotionSpaceId: config.rootNotionSpaceId,
    description: config.description,
  };
};
