import Link from "next/link";
import { fetchFromStrapi } from "../lib/api";

// Add generateStaticParams to ensure proper static generation
export async function generateStaticParams() {
  const blogs = await fetchFromStrapi("blogs");
  return blogs.map((blog) => ({ slug: blog.attributes.Slug }));
}

// Make the page static with dynamic data
export const revalidate = 3600;

export default async function HomePage() {
  const blogs = await fetchFromStrapi(
    "blogs?populate[0]=author&populate[1]=Content"
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Blog</h1>
          <p className="text-lg text-gray-600">
            Discover the latest insights and updates
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {blogs.map((blog) => {
            return (
              <article
                key={blog.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6"
              >
                <div className="flex flex-col h-full">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                    <Link href={`/blog/${blog?.Slug}`}>{blog?.Title}</Link>
                  </h2>

                  {blog?.Content && blog?.Content[0] && (
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">
                      {blog?.Content[0].Text_Block}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {blog?.author?.data?.attributes?.name?.charAt(0) ||
                            "A"}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">
                        {blog?.author?.name || "Anonymous"}
                      </span>
                    </div>

                    {/* Use client component for date formatting */}
                    <span className="text-sm text-gray-500">
                      {new Date(blog?.publishedAt).toISOString().split("T")[0]}
                    </span>
                  </div>

                  <Link
                    href={`/blog/${blog?.Slug}`}
                    className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Read more
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        {(!blogs || blogs.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No blog posts available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
