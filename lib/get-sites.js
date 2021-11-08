import { getSiteForDomain } from "./get-site-for-domain";
import * as config from "./config";

export async function getSites() {
  return [await getSiteForDomain(config.domain)];
}
