---
slug: microboot
title: "New feature: MicroBoot"
authors: [steelcrab]
tags: [release, firecracker, guide]
# Same-day sort key (display uses UTC date only)
date: 2026-08-07T03:06
---

![MicroBoot](/img/microboot-icon.svg)

FireCrab now includes **MicroBoot**. Even a fresh installation with no templates can bootstrap
Alpine, Ubuntu, and Rocky templates from the web interface.

{/* truncate */}

## What is MicroBoot?

MicroBoot is a **minimal internal boot environment** used only during image bootstrapping. It is
based on the official Alpine Linux netboot kernel and initramfs and is not exposed as a regular
template to users.

MicroBoot is used exclusively to start the builder VM that creates a new image. When the job
finishes, the **builder VM is deleted**. MicroBoot artifacts may be cached internally for the next
bootstrap operation.

## What is a builder VM?

A builder VM is a temporary worker VM used to create a new operating-system template.

It constructs a rootfs from official distribution sources such as Alpine minirootfs, Ubuntu Base,
or Rocky package repositories. It then packages the rootfs, kernel, and boot configuration as a
template that FireCrab can run.

In other words, a builder VM does not run user services. It is a dedicated environment for
assembling new VM images.

## Why not use existing distribution images?

The default images and artifacts published by upstream distributions such as Ubuntu do not directly
match the FireCrab template format.

FireCrab needs the following components separated and prepared for Firecracker:

- A kernel that Firecracker can boot
- An ext4 rootfs
- Boot arguments and network configuration for the target environment

Upstream artifacts are not distributed as Firecracker-specific templates in this structure.
FireCrab therefore builds the required rootfs and kernel from official distribution sources and
packages them into a Firecracker-compatible template.

MicroBoot is the internal builder environment that performs this process.

## How to use it

1. Select **Bootstrap** for the desired distribution in the FireCrab web interface.
2. FireCrab automatically starts a MicroBoot-based builder VM.
3. The builder VM creates and registers a Firecracker-compatible template.
4. When the process finishes, you can create regular VMs from the new template.

No preinstalled template is required. MicroBoot automatically creates the first template in an
empty FireCrab environment.
