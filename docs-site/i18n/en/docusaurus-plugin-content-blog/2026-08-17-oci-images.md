---
slug: oci-images
title: "New feature: importing OCI images"
authors: [steelcrab]
tags: [release, firecracker, guide]
image: /img/oci-icon.png
date: 2026-08-17T12:00
---

![OCI images](/img/oci-icon.png)

Firecrab can now pull an **OCI image** straight into a bootable MicroVM template. Point it at a familiar container reference like `nginx:1.27` and get a bootable M2Image without preparing a kernel or rootfs by hand.

{/* truncate */}

## What changed?

Until now, creating a VM in Firecrab meant installing an M2Image or bootstrapping a distribution yourself.

Now you can just point at an image already sitting in a container registry.

1. Check whether it can run on this host's architecture first (inspect).
2. Once confirmed, pull it in as a background job (import).
3. When the import finishes, it's registered like any other M2Image and can be picked when creating a VM.

This works with Docker Hub as well as any private registry that speaks the standard OCI registry protocol.

## How to use it

The dashboard's **Images** screen lets you inspect an OCI reference and import it right away. The API works the same way.

First, check whether the image can run on this host. This request reads metadata only — it doesn't download the config or any layers.

```sh
curl -s 'http://127.0.0.1:3000/api/oci/inspect?reference=nginx:1.27'
```

The reference is written the same way as `docker pull`, so a bare name resolves to `latest`. A missing architecture for this host is rejected.

Import is a background job, since it can easily exceed the REST request timeout (10 seconds).

```sh
curl -s -X POST http://127.0.0.1:3000/api/oci/import \
  -H 'Content-Type: application/json' \
  -d '{"reference":"nginx:1.27"}'
```

Poll `GET /api/oci/import/{alias}` for progress, using the same response shape as package installs. Once it finishes, the alias appears in `GET /api/images`. A bad reference returns `400`, an alias that's already registered returns `409 alias_collision`, and a job already running for that alias returns `409 import_in_progress`.

## How it works internally

An OCI image isn't a bootable operating system on its own. The internal pipeline turns a registry tree into a Firecracker rootfs.

```text
inspect against the registry → cache and decompress layers → merge layers
  → inject a guest runtime → build the ext4 rootfs → pair a kernel → register the alias
```

Layers are cached by their SHA-256 digest, and every decompression re-verifies that digest; a corrupt cache entry is discarded and re-fetched. Layers are merged in manifest order following whiteout (`.wh.*`) rules to produce the final file tree.

## Why does a container image boot as a VM?

A container image has no PID 1, no DHCP client, and no way to report that it's ready. Firecrab injects a statically built busybox at import time to stand in for all three.

When the VM starts, `/proc/1/exe` points at `/etc/firecrab/busybox`, not the image's entrypoint. This busybox mounts `/proc`, `/sys`, and `/dev`, requests an address over DHCP, and registers the original image's Entrypoint, Cmd, Env, and WorkingDir as an ordinary service under `/etc/firecrab/services.d/app`, started afterward. The image's entrypoint still runs — it's just never PID 1. `ls -l /sbin/init` may still show the image's original `systemd` symlink, but the injected busybox is what's actually running there.

## Imported safely

Before extraction, every layer archive is scanned for members that escape the target directory, links with no target, and unsupported special files (character/block devices, FIFOs). Malformed headers or truncated bodies stop the import immediately.

Layers and config blobs are re-verified by size and SHA-256 both when cached and when reused. The ext4 image is only published after `tune2fs` confirms free space remains, and a failure leaves no partial file behind.

## Wrapping up

You can now bring a container image you're already using straight in as a MicroVM template, with no separate image-build step. Head to the **Images** screen, inspect the OCI reference you want, import it, and create a VM.

### See also

- [OCI images (public-docs)](https://github.com/SteelCrab/firecrab/blob/main/public-docs/oci.md)
