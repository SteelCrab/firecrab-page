---
slug: microregistry-registry-hosting
title: "새 기능: MicroRegistry로 이미지 설치하기"
authors: [steelcrab]
tags: [release, firecracker, guide]
image: /microregistry-icon.png
date: 2026-08-11T12:00
---

![MicroRegistry](pathname:///microregistry-icon.png)

Firecrab에 **MicroRegistry**가 추가되었습니다.

이제 배포판 이미지를 직접 찾아서 복사하지 않아도 됩니다. 대시보드에서 원하는 이미지를 고르고 다운로드한 뒤 바로 설치할 수 있습니다.

{/* truncate */}

## 무엇이 달라졌나요?

이전에는 Firecracker에서 사용할 커널과 rootfs를 호스트에 직접 준비해야 했습니다.

이제 MicroRegistry가 다음 작업을 도와줍니다.

1. 설치할 수 있는 이미지를 보여 줍니다.
2. 현재 호스트의 CPU에 맞는 이미지만 표시합니다.
3. 선택한 이미지 패키지를 다운로드합니다.
4. 패키지를 확인한 뒤 VM 템플릿으로 설치합니다.

현재 지원하는 이미지는 다음과 같습니다.

| 배포판 | 이미지 이름 | 지원 CPU |
| --- | --- | --- |
| Alpine Linux 3.24.1 | `alpine-3.24` | x86_64 · ARM64 |
| Ubuntu 26.04 | `ubuntu-26.04` | x86_64 · ARM64 |
| Rocky Linux 9.8 | `rocky-9.8` | x86_64 · ARM64 |

`rocky-9`처럼 버전이 모호한 이름은 사용하지 않습니다. 실제 버전을 알 수 있도록 `rocky-9.8`로 표시합니다.

## 사용 방법

Firecrab 대시보드에서 **Images** 화면을 엽니다.

![MicroRegistry에서 Ubuntu 이미지 다운로드 중](/img/microregistry-download.png)

다운로드 진행률과 로그를 같은 화면에서 확인할 수 있습니다.

MicroRegistry 목록에서 원하는 이미지를 찾은 뒤 다음 순서로 진행합니다.

```text
Download → Install → VM 만들기
```

- **Download**: 이미지 패키지를 호스트에 내려받습니다.
- **Install**: 패키지를 풀고 Firecrab 템플릿으로 등록합니다.
- **VM 만들기**: 설치된 이미지를 선택해 새 MicroVM을 만듭니다.

다운로드와 설치를 나눈 이유도 단순합니다. 다운로드가 끝난 패키지는 호스트에 보관되므로, 설치한 이미지를 지웠더라도 다시 다운로드하지 않고 설치할 수 있습니다.

## Registry에는 무엇이 있나요?

Registry에는 두 종류의 파일이 있습니다.

- `catalog.json`: 설치할 수 있는 이미지 목록
- `tar.zst`: 커널, initramfs, ext4 rootfs가 들어 있는 이미지 패키지

MicroRegistry는 `catalog.json`을 읽고 현재 호스트에 필요한 항목만 보여 줍니다. x86_64 호스트에는 x86_64 이미지를, ARM64 호스트에는 ARM64 이미지를 표시합니다.

패키지는 배포판, 버전, CPU 종류에 따라 나뉩니다.

```text
alpine/3.24.1/x86_64/alpine-3.24.tar.zst
alpine/3.24.1/aarch64/alpine-3.24.tar.zst
ubuntu/26.04/x86_64/ubuntu-26.04.tar.zst
ubuntu/26.04/aarch64/ubuntu-26.04.tar.zst
rocky/9.8/x86_64/rocky-9.8.tar.zst
rocky/9.8/aarch64/rocky-9.8.tar.zst
```

이 구조 덕분에 이름이 같은 배포판도 CPU 종류를 구분해서 안전하게 설치할 수 있습니다.

## Docker Registry인가요?

아닙니다. MicroRegistry는 Docker 이미지나 OCI 이미지를 다루지 않습니다.

Firecracker가 바로 사용할 수 있는 커널과 ext4 rootfs를 하나의 M2Image 패키지로 제공합니다. 이미지를 설치하는 호스트에도 Docker가 필요하지 않습니다.

## 다운로드한 파일은 안전하게 확인합니다

Firecrab은 다운로드가 끝난 파일을 바로 설치하지 않습니다.

먼저 패키지 안에 필요한 커널과 rootfs가 있는지 확인합니다. 허용되지 않은 경로나 잘못된 파일이 있으면 설치하지 않습니다. 확인을 통과한 패키지만 템플릿으로 등록합니다.

## 배포판 버전 관리

지원 배포판과 버전은 `packaging/m2images.json`에서 관리합니다.

새 버전이 나오면 이 파일에서 배포판 버전, 이미지 이름, 파일 경로를 함께 변경할 수 있습니다. 빌드 스크립트와 Firecrab API도 같은 정보를 사용하므로 서로 다른 버전을 가리킬 가능성이 줄어듭니다.

## 다른 Registry 사용하기

기본 공개 Registry 대신 사설 Registry나 사내 미러도 사용할 수 있습니다. 같은 형식의 `catalog.json`과 이미지 패키지를 제공하면 됩니다.

```bash
FIRECRAB_IMAGE_BASE_URL=https://registry.example.com
```

원격 이미지 설치를 사용하지 않으려면 값을 `none`으로 지정할 수 있습니다.

## 마치며

MicroRegistry가 추가되면서 Firecrab 이미지를 준비하는 과정이 간단해졌습니다.

이제 대시보드에서 호스트에 맞는 이미지를 확인하고, 다운로드하고, 설치한 뒤 바로 MicroVM을 만들 수 있습니다.

### 참고

- [Firecrab 공개 Registry](https://registry.firecrab.dev/catalog.json)
