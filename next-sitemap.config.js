module.exports = {
  siteUrl: "https://portfolio-souravkhan.vercel.app", // your actual deployed URL
  generateRobotsTxt: true, // generates robots.txt
  sitemapSize: 7000,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/404"], // optional
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
    ],
  },
};
