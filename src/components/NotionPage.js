import Head from "next/head";
import NextLink from "next/link";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { getPageTitle } from "notion-utils";
import * as config from "lib/config";
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
import { getCanonicalPageUrl, mapPageUrl } from "lib/map-page-url";

const Equation = dynamic(() =>
  import("react-notion-x").then((notion) => notion.Equation)
);

const Modal = dynamic(
  () => import("react-notion-x").then((notion) => notion.Modal),
  { ssr: false }
);

export default function NotionPage({ site, recordMap, error, pageId }) {
  const router = useRouter();

  const params = {};

  const searchParams = new URLSearchParams(params);

  // If the page is not yet generated, this will be displayed
  // initially until getStaticProps() finishes running
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!recordMap) {
    return null;
  }

  const keys = Object.keys(recordMap?.block || {});
  const block = recordMap?.block?.[keys[0]]?.value;

  const title = getPageTitle(recordMap);

  const isBlogPost =
    block.type === "page" && block.parent_table === "collection";
  const showTableOfContents = !!isBlogPost;
  const minTableOfContentsItems = 3;

  const siteMapPageUrl = mapPageUrl(site, recordMap, searchParams);

  const canonicalPageUrl =
    !config.isDev && getCanonicalPageUrl(site, recordMap)(pageId);

  return (
    <>
      <Head>
        {canonicalPageUrl && (
          <>
            <link rel="canonical" href={canonicalPageUrl} />
            <meta property="og:url" content={canonicalPageUrl} />
            <meta property="twitter:url" content={canonicalPageUrl} />
          </>
        )}

        <title>{title}</title>
      </Head>

      <div>
        <NotionRenderer
          className={`pt-32 pb-16`}
          recordMap={recordMap}
          rootPageId={site.rootNotionPageId}
          fullPage={true}
          darkMode={true}
          showCollectionViewDropdown={false}
          showTableOfContents={showTableOfContents}
          minTableOfContentsItems={minTableOfContentsItems}
          mapPageUrl={siteMapPageUrl}
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
                href={`/blog${href}`}
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
