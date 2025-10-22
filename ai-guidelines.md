# Project Guidelines

## Project Structure

- [e2e](e2e) - End-to-end testing directory — put all user journeys in this directory.
- Unit tests should stay alongside their pages named ".test.js", following this example: [demo.spec.ts](src/demo.spec.ts)
- [messages](messages) - Put all text messages in multiple languages here.
- [settings.json](project.inlang/settings.json) - Configuration of which languages the project supports and how many.
- [static](static) - Static files; no AI should modify this directory.
- [.env](.env) [.env.example](.env.example) - Always keep the ".env" and ".env.example" files in sync with the same content, but mask the values in the example.

- [wrangler.jsonc](wrangler.jsonc) - This file is used for Cloudflare Workers; AIs should check whether the variables match those in ".env".

- [assets](src/lib/assets) - Directory where the server will store raw files. Probably no AI will use this directory.
- [paraglide](src/lib/paraglide) - Ignore this directory.
- [routes](src/routes) - This is where all pages and CRUDs are created!

- [worker-configuration.d.ts](src/worker-configuration.d.ts) - This file is owned by Cloudflare. It must not be changed.