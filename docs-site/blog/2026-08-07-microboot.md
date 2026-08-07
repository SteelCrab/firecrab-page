---
slug: microboot
title: "새 기능 출시: MicroBoot"
authors: [steelcrab]
tags: [release, firecracker, guide]
---

![MicroBoot](/img/microboot-icon.svg)

Firecrab에 **MicroBoot**가 추가되었습니다. 이제 설치된 템플릿이 하나도 없는 새 환경에서도 웹에서 Alpine, Ubuntu, Rocky 템플릿을 부트스트랩할 수 있습니다.

{/* truncate */}

## MicroBoot란?

MicroBoot는 이미지 부트스트랩 과정에서만 사용하는 **내부용 최소 부팅 환경**입니다. Alpine Linux의 공식 netboot 커널과 initramfs를 기반으로 하며, 사용자에게 일반 템플릿으로 노출되지는 않습니다.

MicroBoot는 새 이미지를 만드는 빌더 VM을 실행하는 데만 사용됩니다. 작업이 끝나면 **빌더 VM은 삭제**되고, MicroBoot 아티팩트는 다음 부트스트랩을 위해 내부적으로 캐시될 수 있습니다.

## 빌더 VM이란?

빌더 VM은 새 운영체제 템플릿을 만들기 위해 일시적으로 실행되는 작업용 VM입니다.

이 VM은 Alpine minirootfs, Ubuntu Base, Rocky 패키지 저장소 등 배포판의 공식 소스를 사용해 rootfs를 구성합니다. 이후 Firecrab에서 실행할 수 있도록 rootfs, 커널, 부팅 설정을 포함한 템플릿 패키지로 만듭니다.

즉, 빌더 VM은 서비스를 실행하는 VM이 아니라 **새 VM 이미지를 조립하는 전용 환경**입니다.

## 기존 배포판 이미지를 사용하지 않는 이유

Ubuntu 등 업스트림이 제공하는 기본 이미지 또는 배포 아티팩트는 Firecrab 템플릿 형식과 그대로 호환되지 않습니다.

Firecrab은 Firecracker에서 사용할 수 있도록 다음 구성이 분리된 템플릿을 필요로 합니다.

- Firecracker가 부팅할 커널
- ext4 형식의 rootfs
- 해당 환경에 맞춘 부팅 인자와 네트워크 설정

하지만 배포판이 제공하는 기본 아티팩트는 이 구조의 Firecracker 전용 템플릿으로 배포되지 않습니다. 따라서 Firecrab은 공식 배포판 소스를 바탕으로 필요한 rootfs와 커널을 직접 구성하고, Firecracker에 맞는 템플릿으로 패키징합니다.

MicroBoot는 이 생성 과정을 수행하기 위한 내부 빌더 환경입니다.

## 사용 방법

1. Firecrab 웹 화면에서 원하는 배포판의 **부트스트랩**을 선택합니다.
2. Firecrab이 MicroBoot 기반 빌더 VM을 자동으로 시작합니다.
3. 빌더 VM이 Firecracker 호환 템플릿을 생성하고 등록합니다.
4. 생성이 끝나면 해당 템플릿으로 일반 VM을 만들 수 있습니다.

사전 설치된 템플릿은 필요하지 않습니다. MicroBoot가 빈 Firecrab 환경에서 첫 번째 템플릿을 만드는 과정을 자동으로 처리합니다.
