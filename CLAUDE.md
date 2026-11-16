# madheart: rules for publishing Raheel's sites

Every website Raheel runs lives in this one repository, one folder per site under `sites/<domain>/`.
Hosting is **Cloudflare Pages** (free plan, moved from Netlify on 16 Nov 2026 after Netlify's free credits ran out).
Each site has its own Cloudflare Pages project connected to this repo, with its root directory set to `sites/<domain>` and build watch paths limited to that folder. A push to `main` that changes `sites/<domain>/` publishes that site and only that site.

## The only way to change a live site
1. Look up the site in `sites.json`. Edit files only inside its `folder`.
2. Never edit a draft elsewhere (a Claude artifact, a Design canvas, a local copy) and assume it is live. This folder IS the live site.
3. Never ask Raheel to upload, drag or drop files anywhere. Publishing is a git push.
4. Batch changes: collect a round of edits and push once, not once per edit.
5. Commit with a message that starts with the domain, e.g. `secondresponder.ai: add How it works section`.
6. Push to `main`, wait about a minute, then run `scripts/verify.sh <domain> "<text from the change>"` (or check in a browser) and confirm the change is live before telling Raheel it is done.
7. Never push changes to two sites in one commit unless he asked for both.
8. To show Raheel a change before it goes live, push to a branch: Cloudflare builds a free preview at `<branch>.<project>.pages.dev`.

## Site files
- `_headers` sets security headers (Cloudflare Pages format).
- `functions/` holds Cloudflare Pages Functions. secondresponder.ai's waitlist forms post to `/api/waitlist`, which stores each sign-up in the Workers KV namespace `secondresponder-waitlist` (bound as `WAITLIST`). Read sign-ups in Cloudflare → Storage & databases → Workers KV.

## Adding a new project
1. Add an entry to `sites.json` (domain, folder, Cloudflare project, check_text).
2. Create `sites/<domain>/` with `index.html` and a `_headers` copied from an existing site.
3. In Cloudflare: Workers & Pages → Create → Pages → Import from Git → madheart. Project name = domain with dots as dashes (`newsite-com`), framework None, no build command, root directory `sites/<domain>`. Then Settings → Build → set build watch paths to `sites/<domain>/*`.
4. Add the domain to Cloudflare (free plan), point its nameservers at GoDaddy to Cloudflare's, then add it under the project's Custom domains.

## Checks before every push
- `git diff --stat` touches only the intended `sites/<domain>/` folder (plus `sites.json` if registering).
- No personal email address in any page unless Raheel asked for it. Contact route is LinkedIn.
