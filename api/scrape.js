import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();

  const { url } = req.query;

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

    res.status(200).json({ url, title, description, links });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch or parse URL', details: err.message });
  }
}
