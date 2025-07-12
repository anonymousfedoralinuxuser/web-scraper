# Web Scraper API

## Usage

**GET** or **POST** `/api/scrape`

**Params**:
- **url**: Full URL (must start with `https://`)
- **selector**: CSS selector (e.g. `img`, `a`, `.class`, `#id`)

## Examples

**GET**
```
/api/scrape?url=https://example.com&selector=img
```

**POST**
```json
{
  "url": "https://example.com",
  "selector": "a"
}
```

## Response
```json
{
  "count": 2,
  "results": [
    {
      "text": "Link Text",
      "html": "<a href='...'>Link Text</a>",
      "attribute": "https://..."
    }
  ]
}
```

- **attribute** = `href`, `src`, or `null`
- CORS is enabled
