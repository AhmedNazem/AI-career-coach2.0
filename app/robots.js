export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_clerk/"],
    },
    sitemap: "https://ai-career-coach2-0.vercel.app/sitemap.xml", // Replace with your real domain
  };
}
