# madheart: rules for publishing Raheel's sites

Every website Raheel runs lives in this one repository, one folder per site under `sites/<domain>/`.
Netlify watches this repo. A push to `main` that changes `sites/<domain>/` publishes that site and only that site.

## The only way to change a live site
1. Look up the site in `sites.json`. Edit files only inside its `folder`.
2. Never edit a draft elsewhere (a Claude artifact, a Design canvas, a local copy) and assume it is live. This folder IS the live site.
3. Never ask Raheel to upload, drag or drop files into Netlify. Publishing is a git push.
4. Commit with a message that starts with the domain, e.g. `secondresponder.ai: add How it works section`.
5. Push to `main`, then run `scripts/verify.sh <domain>` and confirm the change is live before telling Raheel it is done.
6. Never push changes to two sites in one commit unless he asked for both.

## Adding a new project
1. Add an entry to `sites.json` (domain, folder, Netlify project, forms, check_text).
2. Create `sites/<domain>/` with `index.html` and a `netlify.toml` copied from an existing site, with `base` changed.
3. In Netlify, create the project from this repo (Add new project → Import from Git → madheart) with base directory `sites/<domain>`. Name the Netlify project after the domain with dots as dashes (`newsite-com`).
4. If the site has forms, turn on form detection in Netlify before the first deploy.
5. Record the Netlify site id in `sites.json`.

## Checks before every push
- `git diff --stat` touches only the intended `sites/<domain>/` folder (plus `sites.json` if registering).
- No personal email address in any page unless Raheel asked for it. Contact route is LinkedIn.
