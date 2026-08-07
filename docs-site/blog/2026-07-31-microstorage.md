---
slug: microstorage
title: "새 기능 출시: MicroStorage"
authors: [steelcrab]
tags: [release, firecracker, guide, storage, microstorage]
# 링크 공유(OG/Twitter) 포스터 = 글 메인 이미지
image: /img/microstorage-og.png
---

![MicroStorage](/img/microstorage-icon.png)

Firecrab에 **MicroStorage** 기능이 추가되었습니다. 이제 VM 디스크를 저장할 호스트의 물리 디스크 또는 마운트 경로를 직접 등록하고, VM별로 저장 위치를 선택할 수 있습니다.

{/* truncate */}

## MicroStorage란?

MicroStorage는 호스트에 이미 마운트된 디렉터리에 이름을 붙여 관리하는 스토리지 풀입니다.

VM의 rootfs와 실행에 필요한 디스크 파일은 선택한 MicroStorage 경로에 저장됩니다. 기본 저장 위치 외에 NVMe, 별도 SSD, 대용량 디스크 등을 VM 용도에 따라 나누어 사용할 수 있습니다.

## 왜 MicroStorage가 필요한가요?

여러 VM을 동시에 시작하면 템플릿 복사와 디스크 확장 작업이 같은 물리 디스크에 집중될 수 있습니다. 이 경우 디스크 I/O가 병목이 되어 VM 시작이 느려질 수 있습니다.

MicroStorage를 사용하면 VM 디스크를 여러 저장 장치에 분산할 수 있습니다. 예를 들어 일반 VM은 기본 디스크에 저장하고, I/O가 많은 워크로드는 별도 NVMe 디스크에 저장할 수 있습니다.

## 어떻게 동작하나요?

MicroStorage는 디스크를 포맷하거나 파티션을 생성하지 않습니다. 운영자가 호스트에 마운트한 경로를 Firecrab에 등록하고, Firecrab은 등록된 저장소만 VM 디스크 위치로 사용합니다.

VM 생성 시 선택한 저장소 경로 아래에 VM 전용 디렉터리가 생성됩니다. 이후 VM을 중지했다가 다시 시작해도 rootfs는 유지되고, 실행에 필요한 임시 파일만 새로 생성됩니다.

## 사용 방법

1. 호스트에 사용할 디스크를 원하는 경로에 마운트합니다.
2. 대시보드에서 **MicroStorage** 메뉴를 선택합니다.
3. 저장소 이름과 마운트된 경로를 등록합니다.
4. VM 생성 시 사용할 저장 위치를 선택합니다.
5. VM 디스크가 선택한 MicroStorage에 생성됩니다.

저장소를 지정하지 않으면 기본 저장 위치가 사용됩니다. VM이 할당된 MicroStorage는 해당 VM을 다른 곳으로 재할당하거나 삭제하기 전까지 삭제할 수 없습니다.
