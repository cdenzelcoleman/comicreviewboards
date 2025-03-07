const express = require("express");
const router = express.Router();

router.get("/sitemap.xml", (req, res) => {
  const baseUrl = "https://comicreviewboards-1b3201cae838.herokuapp.com";
  const urls = ["/", "/comics", "/auth/sign-up", "/auth/sign-in"];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map((url) => `<url><loc>${baseUrl}${url}</loc></url>`)
      .join("")}
    </urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(xml);
});

module.exports = router;
