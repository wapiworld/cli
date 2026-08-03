# wapiworld

Command-line access to your WhatsApp API data on
[app.wapiworld.com](https://app.wapiworld.com): projects, WhatsApp sender
instances and their connection state, API keys, opt-in recorded messages, and
one-off WhatsApp message sends.

## Install

```bash
npm install -g wapiworld   # global install
npx wapiworld --help       # or run without installing
```

## Quick start

```bash
wapiworld login             # opens the browser to authorize the CLI
wapiworld instances list    # your WhatsApp senders with their connection state
wapiworld send --instanceId 64a1f2c9e4b0a1b2c3d4e5f6 --chatId +1234567890 --content "Hello"
```

```
Found 2 instance(s):
1. Example Business (+1234567890) [READY] (64a1f2c9e4b0a1b2c3d4e5f6)
2. Example Support (+1987654321) [READY] (64a1f2c9e4b0a1b2c3d4e5f7)

Message sent successfully
```

## Authentication

`wapiworld login` on an interactive terminal asks how you want to log in:

- **Browser** (`wapiworld login --browser`) — starts a temporary localhost
  server, opens your browser to app.wapiworld.com, and receives the session
  tokens on the redirect back. If the browser does not open, visit the
  printed URL by hand; the attempt times out after 5 minutes. Tokens are
  refreshed automatically when they expire.
- **API key** (`wapiworld login --with-key`) — prompts (masked) for an API
  key secret, verifies it against the API, and stores it. The secret is
  never accepted as a command-line argument.

Both credentials land in `~/.wapiworld/`; `wapiworld logout` clears them.

For CI jobs, scripts, and agents, set `WAPIWORLD_API_KEY` to authenticate
with an API key and no login step at all. Precedence: a stored browser
session wins over a stored key, which wins over the environment variable —
so an exported backend key never hijacks an interactive login. Log out first
(or scope `HOME`) when you want the key to apply.

Without a terminal, a command that has no stored credential and no
`WAPIWORLD_API_KEY` fails immediately with exit code 1 and instructions on
stderr — it never opens a browser or waits on a prompt. Key-authenticated
callers can read projects, instances, and recorded messages, and send;
`wapiworld keys …` management requires a browser session.

## JSON output and schema

Every list/get/read subcommand and `wapiworld send` accepts `--json`:
parseable JSON on stdout, no colors, no prose. `send --json` prints a small
result object (`{ "ok": true, "id": …, … }`); `keys list --json` omits
secrets just like its human output. Errors always set exit code 1 and go to
stderr — as a single-line `{"error":{"message":…,"status":…}}` object in
json mode.

`wapiworld schema` prints the whole command tree (commands, options,
arguments) as JSON; `wapiworld schema messages list` prints one subtree.

## Commands

### Session

```bash
wapiworld login                # choose browser or API key interactively
wapiworld login --browser      # browser login
wapiworld login --with-key     # masked prompt for an API key secret
wapiworld logout               # clear the stored session and any stored key
```

### Projects

```bash
wapiworld projects list              # list projects with name and id
wapiworld projects get               # raw JSON for all projects
wapiworld projects get <projectId>   # raw JSON for one project
wapiworld projects read <projectId>  # formatted single-project view
```

### Instances

```bash
wapiworld instances list               # name, phone, status, id per instance
wapiworld instances get                # raw JSON for all instances
wapiworld instances get <instanceId>   # raw JSON for one instance
wapiworld instances read <instanceId>  # formatted view: phone, status, webhook, timestamps
```

An instance is one connected WhatsApp sender. `status` is its connection
state: `READY` means the sender is connected and can send messages.

### Keys

```bash
wapiworld keys list          # key ids and project — prints no secrets
wapiworld keys get <keyId>   # raw JSON — includes the key secret
wapiworld keys read <keyId>  # formatted view — includes the key secret
```

`keys get` and `keys read` print the key's secret, which authorizes sending
WhatsApp messages on your account. Treat that output like a password: do not
paste it into logs, commits, or shared documents.

### Messages

```bash
wapiworld messages list --instanceId <id> --chatId +1234567890 --limit 50
wapiworld messages get --instanceId <id> --chatId +1234567890   # raw JSON
```

`messages list` prints a conversation oldest-first; `messages get` returns the
raw JSON. Options for `list`: `--instanceId`, `--chatId`, `--limit` (default
100), `--skip`, `--startTime`, `--endTime` (ISO timestamps, inclusive lower /
exclusive upper bound). `get` takes `--instanceId`, `--chatId`, `--limit`.

These commands only return content retained by Wapiworld's opt-in message
recording. Recording is resolved at the project, instance, and chat level,
fails closed, and rows expire according to the project's retention period —
an empty result usually means recording is disabled, not that no conversation
happened. Recorded rows are private customer data and can contain third-party
conversation content and contact identifiers; handle the output accordingly.

### Send

```bash
wapiworld send --instanceId <id> --chatId +1234567890 --content "Hello"
wapiworld send    # prompts interactively for anything omitted
```

Sends one WhatsApp message through one of your connected instances.
"Message sent successfully" means the API accepted the request — it is not
proof of delivery or reading. Do not re-run a send after a timeout or an
ambiguous error without checking first: a second call can deliver a duplicate.

### Skills

```bash
wapiworld skills list            # names and descriptions of the bundled agent guides
wapiworld skills get wapiworld   # print a bundled SKILL.md to stdout
```

### Schema

```bash
wapiworld schema                 # the whole command tree as JSON
wapiworld schema messages list   # one subtree
```

## Configuration

A `wapiworld.json` discovered beneath the working directory supplies the
default `--instanceId` for `messages` and `send`:

```json
{ "instanceId": "64a1f2c9e4b0a1b2c3d4e5f6" }
```

Command-line options take priority over the config file.

`WAPIWORLD_API_URL` overrides the API endpoint (default
`https://api.wapiworld.com`) — only needed against a non-production
deployment. `WAPIWORLD_API_KEY` authenticates with an API key when neither a
browser session nor a stored key exists.

## Usage with AI agents

Install the Wapiworld agent skills — `wapiworld` (this CLI) and
`whatsapp-operations` (the MCP-based WhatsApp operations workflow) — for
Claude Code, Cursor, Codex, and any other agent that supports the Skills
standard:

```bash
npx skills add wapiworld/skills
```

The same guides ship inside the npm package, version-matched to the installed
CLI:

```bash
wapiworld skills list            # what is bundled
wapiworld skills get wapiworld   # the CLI guide matching this version
```

Or paste this into your `AGENTS.md` / `CLAUDE.md`:

```markdown
## WhatsApp via Wapiworld

Use the `wapiworld` CLI for WhatsApp API data: projects, sender instances and
their connection state, API keys, opt-in recorded messages, and one-off
message sends. Run `npx wapiworld skills get wapiworld` for the full guide,
and `wapiworld --help` for the command reference. Log in once with
`wapiworld login`.
```

Prefer a connector? The Wapiworld MCP server at
`https://mcp.wapiworld.com/mcp` exposes safe project, instance-health,
recording-policy, and webhook diagnostics plus a confirmed single-message
send as tools for Claude, ChatGPT, and any MCP-capable host — see
[app.wapiworld.com/developers](https://app.wapiworld.com/developers).

## License

[Apache-2.0](LICENSE)
