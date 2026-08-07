---
slug: micronetwork
title: "새 기능 출시: MicroNetwork"
authors: [steelcrab]
tags: [release, firecracker, guide, micronetwork]
# 링크 공유(OG/Twitter) 포스터 = 글 메인 이미지
image: /img/micronetwork-og.png
---

![MicroNetwork](/img/micronetwork-icon.png)

Firecrab에 **MicroNetwork** 기능이 추가되었습니다. 이제 VM을 만들기 전에 필요한 가상 네트워크를 직접 생성하고, 각 VM을 원하는 네트워크에 연결할 수 있습니다.

{/* truncate */}

## MicroNetwork란?

MicroNetwork는 Firecrab에서 사용하는 사용자 정의 가상 네트워크입니다. 하나의 서브넷을 기준으로 bridge, gateway, DHCP, NAT, 방화벽 규칙을 함께 구성합니다.

VM이 사용할 네트워크 범위와 인터넷 연결 여부를 직접 관리할 수 있습니다.

## 왜 MicroNetwork가 필요한가요?

기존처럼 VM을 보이지 않는 기본 네트워크에 자동 연결하면, 어떤 VM이 어느 네트워크에 속하는지 관리하기 어렵습니다.

MicroNetwork는 네트워크 이름과 CIDR을 명시적으로 생성하고, VM 생성 시 연결할 네트워크를 선택하는 방식입니다. 이를 통해 네트워크 구성을 명확히 관리하고, 서로 다른 MicroNetwork에 속한 VM을 기본적으로 분리할 수 있습니다.

## 어떻게 동작하나요?

MicroNetwork를 생성하면 Firecrab이 호스트에 필요한 네트워크 구성을 자동으로 적용합니다. VM이 연결될 가상 bridge를 만들고, gateway와 DHCP를 설정합니다.

인터넷 연결을 허용한 네트워크에는 NAT가 적용되며, 서로 다른 MicroNetwork 사이의 통신은 차단됩니다.

## 사용 방법

1. 대시보드에서 **MicroNetwork** 메뉴를 선택합니다.
2. 네트워크 이름, 서브넷 CIDR, 인터넷 연결 여부를 설정해 생성합니다.
3. VM 생성 시 연결할 MicroNetwork를 선택합니다.
4. VM을 시작하면 선택한 네트워크에서 IP 주소를 받아 통신합니다.

MicroNetwork를 먼저 만들어야 VM을 생성할 수 있으며, VM이 사용 중인 네트워크는 삭제할 수 없습니다.
