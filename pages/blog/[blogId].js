import Head from "next/head";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { getPageTitle, getAllPagesInSpace, idToUuid } from "notion-utils";
import { NotionAPI } from "notion-client";
import {
  Collection,
  Code,
  CollectionRow,
  NotionRenderer,
} from "react-notion-x";

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css";

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css";

// used for collection views (optional)
import "rc-dropdown/assets/index.css";

// used for rendering equations (optional)
import "katex/dist/katex.min.css";

// here we're bringing in any languages we want to support for
// syntax highlighting via Notion's Code block
import "prismjs";
import "prismjs/components/prism-markup";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-bash";

const Equation = dynamic(() =>
  import("react-notion-x").then((notion) => notion.Equation)
);

const Modal = dynamic(
  () => import("react-notion-x").then((notion) => notion.Modal),
  { ssr: false }
);

const notion = new NotionAPI();

export const getStaticProps = async (context) => {
  const blogId = context.params.blogId;

  try {
    const recordMap = await notion.getPage(blogId);

    return {
      props: {
        recordMap,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error("Page error", blogId, error);

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw error;
  }
};

export async function getStaticPaths() {
  const rootNotionPageId = "660d9690-3b0f-43d5-829f-39cf12466c3b";
  const rootNotionSpaceId = "69ede2d8-e49e-4e90-b718-586470d59a59";

  // This crawls all public pages starting from the given root page in order
  // for next.js to pre-generate all pages via static site generation (SSG).
  // This is a useful optimization but not necessary; you could just as easily
  // set paths to an empty array to not pre-generate any pages at build time.
  const pages = await getAllPagesInSpace(
    rootNotionPageId,
    rootNotionSpaceId,
    notion.getPage.bind(notion),
    {
      traverseCollections: false,
    }
  );
  const paths = Object.keys(pages).map((blogId) => ({
    params: {
      blogId,
    },
  }));

  return {
    paths,
    fallback: false,
  };
}

export default function NotionDynamicBlog({ recordMap }) {
  const router = useRouter();

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!recordMap) {
    return null;
  }

  const title = getPageTitle(recordMap);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <div>
        <NotionRenderer
          className={`pt-32 pb-16`}
          recordMap={recordMap}
          fullPage={true}
          darkMode={true}
          showCollectionViewDropdown={false}
          components={{
            pageLink: ({
              href,
              as,
              passHref,
              prefetch,
              replace,
              scroll,
              shallow,
              locale,
              ...props
            }) => (
              <NextLink
                href={`/blog/${idToUuid(href.replace("/", ""))}`}
                as={as}
                passHref={passHref}
                prefetch={prefetch}
                replace={replace}
                scroll={scroll}
                shallow={shallow}
                locale={locale}
              >
                <a {...props} />
              </NextLink>
            ),
            code: Code,
            collection: Collection,
            collectionRow: CollectionRow,
            modal: Modal,
            equation: Equation,
          }}
        />
      </div>
    </>
  );
}
