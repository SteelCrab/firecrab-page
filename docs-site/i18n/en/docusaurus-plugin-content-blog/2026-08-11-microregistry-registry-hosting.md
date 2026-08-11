---
slug: microregistry-registry-hosting
title: "New feature: Install images with MicroRegistry"
authors: [steelcrab]
tags: [release, firecracker, guide]
image: /img/microregistry-icon.png
date: 2026-08-11T12:00
---

![MicroRegistry](/img/microregistry-icon.png)

FireCrab now includes **MicroRegistry**.

You no longer need to find and copy distribution images manually. Select an image in the
dashboard, download it, install it, and start creating MicroVMs.

{/* truncate */}

## What has changed?

Previously, you had to prepare the kernel and rootfs for Firecracker directly on the host.

MicroRegistry now handles the following tasks:

1. Lists the images available for installation.
2. Shows only images compatible with the current host CPU.
3. Downloads the selected image package.
4. Validates the package and installs it as a VM template.

The following images are currently available:

| Distribution | Image name | Supported CPU |
| --- | --- | --- |
| Alpine Linux 3.24.1 | `alpine-3.24` | x86_64 · ARM64 |
| Ubuntu 26.04 | `ubuntu-26.04` | x86_64 · ARM64 |
| Rocky Linux 9.8 | `rocky-9.8` | x86_64 · ARM64 |

We avoid ambiguous names such as `rocky-9`. The image is displayed as `rocky-9.8` so its exact
version is always clear.

## How to use it

Open the **Images** page in the FireCrab dashboard.

![Downloading an Ubuntu image from MicroRegistry](/img/microregistry-download.png)

You can monitor download progress and logs on the same page.

Find the image you want in MicroRegistry, then follow this flow:

```text
Download → Install → Create a VM
```

- **Download**: Downloads the image package to the host.
- **Install**: Extracts the package and registers it as a FireCrab template.
- **Create a VM**: Creates a new MicroVM from the installed image.

Download and installation are separate for a simple reason: downloaded packages remain on the
host. Even if you delete an installed image, you can install it again without downloading it a
second time.

## What is in the Registry?

The Registry contains two types of files:

- `catalog.json`: A list of images available for installation
- `tar.zst`: An image package containing a kernel, initramfs, and ext4 rootfs

MicroRegistry reads `catalog.json` and displays only the entries needed by the current host. An
x86_64 host sees x86_64 images, while an ARM64 host sees ARM64 images.

Packages are organized by distribution, version, and CPU architecture:

```text
alpine/3.24.1/x86_64/alpine-3.24.tar.zst
alpine/3.24.1/aarch64/alpine-3.24.tar.zst
ubuntu/26.04/x86_64/ubuntu-26.04.tar.zst
ubuntu/26.04/aarch64/ubuntu-26.04.tar.zst
rocky/9.8/x86_64/rocky-9.8.tar.zst
rocky/9.8/aarch64/rocky-9.8.tar.zst
```

This layout makes it safe to install CPU-specific variants of the same distribution.

## Is it a Docker Registry?

No. MicroRegistry does not handle Docker or OCI images.

It provides the kernel and ext4 rootfs that Firecracker can use directly as a single M2Image
package. Docker is not required on the host that installs the image.

## Downloaded files are validated before installation

FireCrab does not install a file immediately after downloading it.

It first verifies that the package contains the required kernel and rootfs. Packages containing
invalid files or disallowed paths are rejected. Only packages that pass validation are registered
as templates.

## Managing distribution versions

Supported distributions and versions are managed in `packaging/m2images.json`.

When a new version is released, this file lets us update the distribution version, image name, and
file path together. The build scripts and FireCrab API use the same information, reducing the risk
of referring to different versions.

## Using another Registry

You can use a private Registry or an internal mirror instead of the default public Registry. It
only needs to provide `catalog.json` and image packages in the same format.

```bash
FIRECRAB_IMAGE_BASE_URL=https://registry.example.com
```

Set the value to `none` to disable remote image installation.

## Closing

MicroRegistry makes preparing FireCrab images much simpler.

You can now find an image compatible with your host in the dashboard, download it, install it, and
create a MicroVM right away.

### Reference

- [FireCrab public Registry](https://registry.firecrab.dev/catalog.json)
