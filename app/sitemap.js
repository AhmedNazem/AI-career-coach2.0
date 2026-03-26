export default async function sitemap() {
  const baseUrl = "https://ai-career-coach2-0.vercel.app"; // Replace with your real domain

  // Define static routes
  const staticRoutes = [
    "",
    "/dashboard",
    "/jobs",
    "/resume",
    "/roadmap",
    "/tracker",
    "/interview",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.8,
  }));

  return [...staticRoutes];
}
