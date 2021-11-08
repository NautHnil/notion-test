import { useEffect } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { Client } from "@notionhq/client";
import { format, parseISO } from "date-fns";
import { FaRegClock } from "react-icons/fa";
import { LOCATION_ORIGIN } from "@constants";
import slugify from "slugify";
import { isDev } from "lib/config";
import { uuidToId } from "notion-utils";

export default function NotionBlogPage({ results }) {
  // useEffect(() => console.log(results));

  const getDatabaseDisplay = () => {
    let jsx = [];

    results.forEach((blog) => {
      const image = blog.cover?.file
        ? blog.cover.file.url
        : blog.cover?.external
        ? blog.cover.external.url
        : `${LOCATION_ORIGIN}/media/no-img.jpg`;

      const title = blog.properties.Title.title[0]?.plain_text;
      let url = blog.url.toLowerCase().replace("https://www.notion.so/", "");

      if (!isDev) {
        let urlArr = url.split("-");
        urlArr.pop();
        url = urlArr.join("-");
      }

      jsx.push(
        <div
          key={blog.id}
          className="flex flex-col rounded-lg lg:rounded-2xl h-full overflow-hidden bg-gradient-to-tl from-gray-900 to-gray-700 text-white"
        >
          <div className={`relative h-48 rounded-t-lg overflow-hidden`}>
            <img
              className={`relative top-1/2 transform -translate-y-1/2 scale-105`}
              src={image}
              alt={title}
            />
          </div>
          <div className="flex flex-col flex-grow p-5">
            <div className={`mb-auto`}>
              <h2 className="text-xl font-bold font-fancy mb-4">
                <NextLink href={`/blog/${url}`}>
                  <a
                    className={`text-yellow-400 hover:text-yellow-600 transition-colors`}
                  >
                    {title}
                  </a>
                </NextLink>
              </h2>
              <p className={`flex items-center text-sm mb-4`}>
                <span className={`inline-block`}>
                  <FaRegClock size={14} className={`mr-1 -mt-1`} />
                </span>
                <span className={`inline-block align-middle`}>
                  {format(parseISO(blog.created_time), "MMM dd, yyyy p")}
                </span>
              </p>
              <p className="text-sm">
                {blog.properties.Summary.rich_text[0]?.plain_text}
              </p>
            </div>

            <NextLink href={`/blog/${url}`}>
              <a>Read More</a>
            </NextLink>
          </div>
        </div>
      );
    });

    return jsx;
  };

  return (
    <>
      <Head>
        <title>{`Blog`}</title>
      </Head>

      <main
        role="main"
        className={`bg-gradient-to-br from-gray-900 to-gray-800`}
      >
        <div className={`container mx-auto px-4`}>
          <div className="blogs__wrapper py-32 px-20">
            <div className="grid grid-cols-3 gap-6">{getDatabaseDisplay()}</div>
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps = async () => {
  try {
    const notion = new Client({
      auth: process.env.NEXT_PUBLIC_NOTION_API_KEY,
    });
    const databaseId = process.env.NEXT_PUBLIC_NOTION_DATABASE;
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "Public",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return {
      props: {
        results: response.results,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
