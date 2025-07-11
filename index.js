const express = require('express');
const https = require('https');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 443;

const credentials = {
  key: fs.readFileSync('./cert/key.pem'),
  cert: fs.readFileSync('./cert/cert.pem'),
};

app.use(express.json());

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const title = $('title').text();
    const description = $('meta[name="description"]').attr('content') || '';
    const links = [];
    $('a').each((_, el) => {
      const href = $(el).attr('href');
      if (href) links.push(href);
    });

    res.json({ url, title, description, links });
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape site', details: error.message });
  }
});

https.createServer(credentials, app).listen(PORT, () => {
  console.log(`HTTPS Web Scraper API running at https://localhost:${PORT}`);
});
