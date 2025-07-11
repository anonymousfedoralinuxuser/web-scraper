const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;

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

app.listen(PORT, () => {
  console.log(`Web Scraper running at http://localhost:${PORT}`);
});
