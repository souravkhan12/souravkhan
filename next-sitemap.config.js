module.exports = {
  siteUrl: "https://portfolio-souravkhan.vercel.app",
  generateRobotsTxt: false, // We have custom robots.txt
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404", "/api/*"],
  alternateRefs: [
    {
      href: "https://portfolio-souravkhan.vercel.app",
      hrefLang: "en-US",
    },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/api/" },
      { userAgent: "Googlebot", allow: "/" },
    ],
    additionalSitemaps: ["https://portfolio-souravkhan.vercel.app/sitemap.xml"],
  },
};
