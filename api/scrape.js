import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  let url, selector;

  if (req.method === 'GET') {
    url = req.query.url;
    selector = req.query.selector;
  } else {
    
    url = req.body?.url;
    selector = req.body?.selector;
  }

  if (!url || !/^https?:\/\//.test(url)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }
  if (!selector) {
    return res.status(400).json({ error: 'Missing selector parameter' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const results = [];

    $(selector).each((_, el) => {
      const element = $(el);

      let attr = null;
      if (element.is('a')) {
        attr = element.attr('href') || null;
      } else if (element.is('img')) {
        attr = element.attr('src') || null;
      }

      results.push({
        text: element.text().trim(),
        html: $.html(element),
        attribute: attr,
      });
    });

    res.status(200).json({ url, selector, count: results.length, results });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse URL', details: err.message });
  }
}
