---
slug: microstorage
title: "New feature: MicroStorage"
authors: [steelcrab]
tags: [release, firecracker, guide, storage, microstorage]
image: /img/microstorage-og.png
---

![MicroStorage](/img/microstorage-icon.png)

FireCrab now includes **MicroStorage**. You can register a physical disk or mounted path on the host
and choose where each VM is stored.

{/* truncate */}

## What is MicroStorage?

MicroStorage is a storage pool that assigns a name to an existing mounted directory on the host.

VM root filesystems and the disk files required at runtime are stored in the selected MicroStorage
path. This lets you distribute VMs across the default disk, NVMe storage, a separate SSD, or a large
capacity disk according to workload needs.

## Why is MicroStorage needed?

When multiple VMs start at once, template copying and disk expansion can converge on a single
physical disk. Disk I/O can then become a bottleneck and slow VM startup.

MicroStorage lets you spread VM disks across several storage devices. For example, general-purpose
VMs can use the default disk while I/O-intensive workloads use a separate NVMe device.

## How does it work?

MicroStorage does not format disks or create partitions. The operator mounts a path on the host and
registers it with FireCrab. FireCrab only uses registered storage locations for VM disks.

When a VM is created, a dedicated directory is created beneath the selected storage path. The
rootfs remains available after the VM is stopped and restarted; only the temporary runtime files
are recreated.

## How to use it

1. Mount the disk on the host at the path you want to use.
2. Open **MicroStorage** in the dashboard.
3. Register a storage name and the mounted path.
4. Select the storage location when creating a VM.
5. FireCrab creates the VM disk in the selected MicroStorage.

If no storage is selected, FireCrab uses its default location. A MicroStorage assigned to a VM
cannot be deleted until the VM is moved elsewhere or deleted.
