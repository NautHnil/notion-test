import * as config from "lib/config";
import { resolveNotionPage } from "lib/resolve-notion-page";
import { getSiteMaps } from "lib/get-site-maps";
import NotionPage from "src/components/NotionPage";

export const getStaticProps = async (context) => {
  const pageId = context.params.pageId;

  try {
    const props = await resolveNotionPage(config.domain, pageId);

    return { props, revalidate: 10 };
  } catch (error) {
    console.error("Page error", pageId, error);

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw error;
  }
};

export async function getStaticPaths() {
  // if (config.isDev) {
  //   return {
  //     paths: [],
  //     fallback: false,
  //   };
  // }

  const siteMaps = await getSiteMaps();

  const ret = {
    paths: siteMaps.flatMap((siteMap) =>
      Object.keys(siteMap.canonicalPageMap).map((pageId) => ({
        params: {
          pageId,
        },
      }))
    ),
    fallback: false,
  };

  console.log(ret.paths);
  return ret;
}

export default function NotionDynamicBlog(props) {
  return <NotionPage {...props} />;
}
