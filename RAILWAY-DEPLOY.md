# Railway Deploy

Set it like this.

## Source

Leave `Branch` connected to production as `main` if that is the branch you deploy from.

`Root Directory`:

- Leave it blank for this repo. The Ansorum site files live at the repo root: `config.toml`, `content/`, `static/`, and related site folders are already here.

`Wait for CI`:

- Turn it on if you already have GitHub Actions checks you trust.
- Leave it off if you do not use CI yet.

## Networking

After the first successful deploy:

- Go to `Public Networking`
- Click `Generate Domain`

You do not need TCP proxy.

## Build

`Builder`: `Railpack`

`Metal Build Environment`: leave on

`Build command`:

```bash
set -eux; VERSION=v0.2.0-alpha.1; TARGET=x86_64-unknown-linux-musl; mkdir -p /app/.ansorum/bin; curl -fsSL "https://github.com/nibzard/ansorum/releases/download/${VERSION}/ansorum-${VERSION}-${TARGET}.tar.gz" | tar -xz -C /app/.ansorum/bin ansorum; /app/.ansorum/bin/ansorum --version
```

`Watch Paths`:

- Leave empty for this repo. The whole repository is the site.
- If you later move this into a monorepo, add only the paths that should trigger deploys, for example:

```text
/site/**
```

## Deploy

For the first deploy, set `Start Command` to:

```bash
/app/.ansorum/bin/ansorum serve --interface 0.0.0.0 --port "$PORT" --base-url /
```

After Railway generates a public domain, replace it with:

```bash
/app/.ansorum/bin/ansorum serve --interface 0.0.0.0 --port "$PORT" --base-url "https://${RAILWAY_PUBLIC_DOMAIN}" --no-port-append
```

If you later add your own domain, use:

```bash
/app/.ansorum/bin/ansorum serve --interface 0.0.0.0 --port "$PORT" --base-url "https://your-domain.com" --no-port-append
```

`Pre-deploy step`: leave empty

`Healthcheck Path`: set to:

```text
/
```

`Serverless`: leave off

`Restart Policy`: keep `On Failure`

`Max restart retries`: `10` is fine

`Cron Schedule`: leave empty

## Scale

`Replicas`: `1` is fine to start.

## Variables

You do not need to add any variables for the basic deploy.

## Sequence

The only thing to do after filling this in is:

1. Deploy once with `--base-url /`
2. Generate the Railway public domain
3. Replace the start command with the `https://${RAILWAY_PUBLIC_DOMAIN}` version
4. Redeploy
