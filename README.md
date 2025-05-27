## Beehiiv Posts Utility

A TypeScript utility for fetching, processing, and converting"completed" Beehiiv posts into filed (JSON HTML MD).

**NOTE:** Some of the html-to-md formatting assumes specific things for my articles, feel free to remove those.

My Beehiiv: [Truffle Dog Digital](https://truffle-dog-digital.beehiiv.com/) (no paywall)

## Setup & run

1. Install dependencies:

```bash
npm install
```

1. Set up environment variables:

```bash
cp .env.example .env
```

Edit `.env` and add your Beehiiv API credentials:

- `BEEHIIV_API_KEY`: Your Beehiiv API key
- `BEEHIIV_PUBLICATION_ID`: Your publication ID

1. Fetch all posts to local JSON

To fetch all posts with detailed content and save as JSON files:

```bash
npm run get
```

If the process times out or fails partway through, resume from a specific index:

```bash
npm run get -- 150
```

1. Generate HTML & MD from JSON

Convert all stored posts to Markdown and HTML formats:

```bash
npm run gen
```

## List Posts Only

To just list all post slugs without fetching detailed content:

```bash
npm run lst
```

## Output

- **JSON files**: Stored in `posts/` directory with full post data
- **Markdown files**: Stored in `markdown-html/` directory as `.md` files
- **HTML files**: Stored in `markdown-html/` directory as `.html` files

Files are named using the post slug for easy identification.
