---
slug: micronetwork
title: "New feature: MicroNetwork"
authors: [steelcrab]
tags: [release, firecracker, guide, micronetwork]
image: /img/micronetwork-og.png
# Same-day sort key (display uses UTC date only)
date: 2026-07-31T18:00
---

![MicroNetwork](/img/micronetwork-icon.png)

FireCrab now includes **MicroNetwork**. You can create a virtual network before creating a VM and
connect each VM to the network you choose.

{/* truncate */}

## What is MicroNetwork?

MicroNetwork is a user-defined virtual network in FireCrab. It manages a bridge, gateway, DHCP,
NAT, and firewall rules together around a single subnet.

You control the address range used by VMs and whether they can reach the internet.

## Why is MicroNetwork needed?

Automatically attaching VMs to an invisible default network makes it difficult to understand which
VM belongs to which network.

With MicroNetwork, you explicitly create a named network and CIDR, then select that network when
creating a VM. This makes the network layout clear and isolates VMs on different MicroNetworks by
default.

## How does it work?

When you create a MicroNetwork, FireCrab automatically applies the required configuration to the
host. It creates the virtual bridge used by the VMs and configures the gateway and DHCP.

NAT is applied to networks that allow internet access, while communication between different
MicroNetworks is blocked.

## How to use it

1. Open **MicroNetwork** in the dashboard.
2. Enter a network name, subnet CIDR, and internet access policy, then create the network.
3. Select the MicroNetwork when creating a VM.
4. Start the VM. It receives an IP address from the selected network and can begin communicating.

A MicroNetwork must exist before you can create a VM. A network currently used by a VM cannot be
deleted.
