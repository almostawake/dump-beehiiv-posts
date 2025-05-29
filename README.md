## Commandline utility for dumping beehiiv posts to HTML+MD files

My goal for this was to generate cut-down MD files of my content for loading into LLMs. Let me know if you use it for something else 😬

A typeScript utility for:

- **Fetching posts from Beehiiv**
  - Grabs "complete" posts
  - Grabs the post meta-data plus "premium email content" which is HTML
  - Stores them in the "posts" folder, one file per post, the JSON includes embedded html
  - If a file exists already, it doesn't grab the HTML again or overwrite the file
  - Delete JSON files (individual or all) if you want them re-fetched
- **Generating HTML and MD** from the previously grabbed JSON files
  - Regenerates all HTML/MD from existing JSON files (only) each run
  - The HTML is left as-is
  - MD generation pre-processes HTML to remove stuff that wasn't part of the actual post, like socials, the Beehiiv footer, author information. Some of these are specific to my content e.g. it looks for my name and removes everything around it. I've tried to keep it modular so you can make changes with the help of an LLM without being a coder (I built this with Claude Code doing the heavy lifting).
  - At the top, the MD includes publication date in ISO format (e.g. 2025-05-28) and post URL so LLMs can use that information in structured form.

Files are named using the post slug for easy identification.

My Beehiiv: [Truffle Dog Digital](https://truffle-dog-digital.beehiiv.com/) (just for reference, also it doesn't have a paywall)

A good post to see some of the garbage I'm removing is [Why is Generative AI Magic?](https://truffle-dog-digital.beehiiv.com/p/why-is-generative-ai-magic)

## Setup

1. Install dependencies:

   - `npm install`

1. Make an .env file:

   - `cp .env.example .env`

1. Add your beehiiv API key to the .env file

   - Gear icon (bottom left in Beehiiv nav)
   - API
   - Create new API key
   - Copy that into .env (leave BEEHIIV_PUBLICATION_ID as-is for now)

1. Add beehiiv publication ID to .env file

   - `npm run listpubs`
   - grab the publication ID that you want to dump posts from
   - add that to .env file

1. Test by just listing the posts
   - `npm run listposts`

## Fetch all posts to local JSON

Fetch all posts with detailed content and save as JSON files

`npm run get`

## Generate (regenerate) all HTML and MD files

Just works with the JSON files we currently have and is super-quick because no API calls are being made.

`npm run gen`
