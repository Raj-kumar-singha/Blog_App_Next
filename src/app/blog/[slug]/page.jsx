import { fetchFromStrapi } from "../../../lib/api";
import Link from "next/link";

export const revalidate = 10;

export async function generateStaticParams() {
  const blogs = await fetchFromStrapi("blogs");
  return blogs.map((blog) => ({
    Slug: blog.Slug,
  }));
}

export default async function BlogPage({ params }) {
  const { slug } = await params;

  const blogs = await fetchFromStrapi(
    `blogs?filters[Slug][$eq]=${slug}&populate[0]=author&populate[1]=Content`
  );

  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Blog not found
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-800">
            Return to home
          </Link>
        </div>
      </div>
    );
  }

  const blog = blogs[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-8"
        >
          <svg
            className="mr-2 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog List
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8">
          <header className="mb-8 pb-6 border-b border-gray-200">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {blog?.Title}
            </h1>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {blog.author?.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {blog.author?.name || "Anonymous"}
                  </p>
                  {blog.author?.email && (
                    <p className="text-gray-500">{blog.author.email}</p>
                  )}
                </div>
              </div>

              <span className="text-gray-400">•</span>

              <span className="text-gray-600">
                {
                  new Date(blog.publishedAt || blog.createdAt)
                    .toISOString()
                    .split("T")[0]
                }
              </span>
            </div>
          </header>

          {/* Blog Content */}
          <div className="prose max-w-none">
            {blog.Content &&
              blog.Content.map((block, index) => {
                const blockId = block?.id || `content-block-${index}`;

                if (block.__component === "content-block.content-block") {
                  return (
                    <div key={blockId} className="space-y-6 mb-6">
                      {block.Text_Block && (
                        <div className="text-gray-700 leading-relaxed text-lg">
                          {block.Text_Block}
                        </div>
                      )}
                    </div>
                  );
                }

                if (block.__component === "quote-block.quote-block") {
                  return (
                    <div key={blockId} className="space-y-6 mb-6">
                      {block.Quote_Block && (
                        <blockquote className="border-l-4 border-blue-500 pl-6 py-4 bg-blue-50 rounded-r-lg my-6">
                          <div className="text-gray-800 italic text-lg leading-relaxed">
                            {block.Quote_Block.split("–")[0]?.trim()}
                          </div>
                          {block?.Quote_Block.includes("–") && (
                            <cite className="text-gray-600 font-medium mt-2 block">
                              – {block?.Quote_Block.split("–")[1]?.trim()}
                            </cite>
                          )}
                        </blockquote>
                      )}
                    </div>
                  );
                }

                return null;
              })}
          </div>

          {/* Author Bio */}
          {blog.author?.bio && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About the Author
              </h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xl font-medium">
                    {blog.author.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {blog.author.name}
                  </h4>
                  <p className="text-gray-600">{blog.author.bio}</p>
                </div>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
