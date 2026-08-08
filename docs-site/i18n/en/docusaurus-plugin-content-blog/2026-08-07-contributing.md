---
slug: contributing
title: "Contributions welcome — firecrab CONTRIBUTING guide"
authors: [steelcrab]
tags: [guide, devlog]
# Link share (OG/Twitter) poster — icon instead of default og.png
image: /img/firecrab-icon.png
# Same-day sort key (display uses UTC date only)
date: 2026-08-07T09:11
---

![FireCrab](/img/firecrab-icon.png)

Here is how to contribute to **firecrab**, a single-host microVM platform on Firecracker.
Doc typos, install failures, and small bug reports all count.

{/* truncate */}

## A note from the maintainers

**Contributors are welcome.**
We publish as much as we can so anyone can join easily. Small work counts: doc typos, tiny bug reports, and the rest. Final review and merge are handled by SteelCrab.

**Security and stability come first.**
The project is structurally complex and aims to be usable in enterprise-style environments. We care more about security and stability than adding features for their own sake.

**Installation failures are useful issues.**
If `install.sh` fails mid-way, do not assume “it is only my machine.” Please open an Issue when you can. Repro environment, logs, and which step failed are already a big help.

**Be kind to each other.**
Please keep contributor discussion respectful. Prefer positive wording and a light emoji over harsh negatives. 🙏

**Overlapping work is coordinated together.**
When similar features are in flight, SteelCrab aims to integrate them and keep the result as shared credit.

**It is okay if maintenance pauses.**
If life makes it hard to keep a PR moving, maintainers may pick it up, polish it, and land it. Personal circumstances are understood; just contributing already helps. A stalled commit or PR does not make the contribution meaningless.

---

## Where contributors usually work

| Area | Location |
|---|---|
| REST API, VM lifecycle, images, SQLite | `firecrab-api/` |
| Shared request/response types | `firecrab-api-types/` |
| Unix-socket protocol between API and helper | `firecrab-helper-protocol/` |
| Privileged host networking | `firecrab-net-helper/` |
| Browser dashboard | `firecrab-frontend/` |
| Installer and doctor | `install.sh`, `scripts/` |

Keep host privileges small: the API stays unprivileged; only `firecrab-net-helper` owns network capabilities.

## Develop from source

Run the API from the repository root. Three terminals are enough:

```sh
# 1) Privileged network helper
./scripts/dev-net-helper.sh

# 2) API
cargo run -p firecrab-api

# 3) Dashboard → http://localhost:8080/
npm install --prefix firecrab-frontend
npm run dev --prefix firecrab-frontend
```

## Checks before a PR

```sh
cargo fmt --all -- --check
cargo clippy --workspace --all-targets
cargo test --workspace --locked

npm ci --prefix firecrab-frontend
npm run lint --prefix firecrab-frontend
npm run build --prefix firecrab-frontend

python3 scripts/check-doc-links.py
shellcheck install.sh scripts/firecrab-doctor.sh
```

## Security defaults

- Default bind is loopback (`127.0.0.1:3000`). Do not assume auth or multi-tenant isolation.
- Prefer extending the helper protocol over giving the API new host privileges.
- Report sensitive security issues privately to maintainers rather than opening a public issue with exploit detail.

## Get started

1. Fork [SteelCrab/firecrab](https://github.com/SteelCrab/firecrab) or open a branch if you have write access.
2. Prefer a focused PR — one concern per change when practical.
3. Describe what changed and why, and link related issues.
4. Full detail lives in the repo: [CONTRIBUTING.md](https://github.com/SteelCrab/firecrab/blob/main/CONTRIBUTING.md) · [한국어](https://github.com/SteelCrab/firecrab/blob/main/CONTRIBUTING.ko.md).

Architecture, install, and API contracts continue on [Docs](/en/docs) and in the GitHub repository.
A small PR or a single install-failure log still makes firecrab sturdier. Welcome aboard. 🦀
