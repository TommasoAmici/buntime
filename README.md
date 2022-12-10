# Buntime

This is a, currently, minimal implementation of a Wakatime compatible API.

It supports creating users, generating API tokens and recording heartbeats in the database.

It also implements a part of the status bar endpoint.

I wrote this to try out Bun for web development. It uses [Bun's built-in SQLite module](https://github.com/oven-sh/bun#bunsqlite-sqlite3-module)
to store data, and it uses [Bun's built-in HTTP server](https://github.com/oven-sh/bun#bunserve---fast-http-server)
for the API.

This project is definitely not feature complete, so if you found this while looking for
a self-hostable backend compatible with Wakatime plugins, check out
[Hakatime](https://github.com/mujx/hakatime) and [Wakapi](https://github.com/muety/wakapi)
in the meantime.

## Getting started

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

By default the server runs on port 3000, configurable through the `PORT` environment variable.

This project was created using `bun init` in bun v0.3.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## User guide

### Update .wakatime.cfg

```toml
[settings]
status_bar_enabled = true
api_key = "waka_XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX"
api_url = "http://127.0.0.1:3000/api/v1/users/current/heartbeats.bulk"
```

### Signup

Since there is no frontend yet, you will have to send a request with a JSON body
containing `username`, `password`. `email` is optional, and it currently has no use, but
should I not abandon this project it might be useful for resetting passwords.

```sh
http --json http://localhost:3000/api/v1/users/signup username=XXX password=XXX email=(optional)
```

### Login

You can login by sending a JSON body with `username` and `password`. The response will
return the API token you need to authorize your requests to the API

```sh
http --json http://localhost:3000/api/v1/users/login username=XXX password=XXX
```
