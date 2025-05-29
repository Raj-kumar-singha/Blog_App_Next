// lib/api.js
export async function fetchFromStrapi(endpoint = "") {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_STRAPI_URL;
    const url = `${baseUrl}/api/${endpoint}`;

    const res = await fetch(url, {
      // Add cache options for better control over data fetching
      cache:
        process.env.NODE_ENV === "development" ? "no-store" : "force-cache",
      next:
        process.env.NODE_ENV === "development"
          ? { revalidate: 0 }
          : { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch from Strapi: ${res.status}`);
    }

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    return [];
  }
}
