---
slug: oci-images
title: "새 기능 출시: OCI 이미지 가져오기"
authors: [steelcrab]
tags: [release, firecracker, guide]
image: /img/oci-icon.png
date: 2026-08-17T12:00
---

![OCI images](/img/oci-icon.png)

Firecrab이 **OCI 이미지**를 바로 가져와 MicroVM 템플릿으로 쓸 수 있게 되었습니다. `nginx:1.27`처럼 익숙한 컨테이너 이미지 참조 하나로, 커널과 rootfs를 직접 준비하지 않고도 부팅 가능한 M2Image를 만들 수 있습니다.

{/* truncate */}

## 무엇이 달라졌나요?

지금까지 Firecrab에서 VM을 만들려면 M2Image를 설치하거나 배포판을 직접 부트스트랩해야 했습니다.

이제 컨테이너 레지스트리에 있는 이미지를 그대로 가리키기만 하면 됩니다.

1. 이 호스트 아키텍처에서 실행 가능한지 먼저 확인합니다(inspect).
2. 확인이 끝나면 백그라운드 작업으로 가져옵니다(import).
3. 가져오기가 끝나면 다른 M2Image와 똑같이 목록에 등록되고, VM 생성 시 선택할 수 있습니다.

Docker Hub뿐 아니라 표준 OCI 레지스트리 프로토콜을 쓰는 사설 레지스트리도 그대로 사용할 수 있습니다.

## 사용 방법

대시보드 **Images** 화면에서 OCI 참조를 입력해 검사한 뒤 바로 가져올 수 있습니다. API로도 동일하게 동작합니다.

먼저 이 호스트에서 실행 가능한지 확인합니다. 이 요청은 설정이나 레이어를 내려받지 않고 메타데이터만 읽습니다.

```sh
curl -s 'http://127.0.0.1:3000/api/oci/inspect?reference=nginx:1.27'
```

`docker pull`과 같은 표기를 사용하므로, 태그를 생략하면 `latest`로 해석됩니다. 이 호스트 아키텍처용 이미지가 없으면 거부됩니다.

가져오기는 REST 요청 제한 시간(10초)을 넘길 수 있어 백그라운드 작업으로 처리됩니다.

```sh
curl -s -X POST http://127.0.0.1:3000/api/oci/import \
  -H 'Content-Type: application/json' \
  -d '{"reference":"nginx:1.27"}'
```

같은 응답 형식으로 `GET /api/oci/import/{alias}`를 폴링해 진행 상태를 확인합니다. 완료되면 `GET /api/images` 목록에 별칭(alias)이 추가됩니다. 잘못된 참조는 `400`, 이미 등록된 별칭은 `409 alias_collision`, 진행 중인 같은 작업은 `409 import_in_progress`로 응답합니다.

## 내부적으로 어떻게 동작하나요?

OCI 이미지는 그 자체로는 부팅 가능한 운영체제가 아닙니다. 내부 파이프라인이 레지스트리 트리를 Firecracker rootfs로 바꿔 줍니다.

```text
레지스트리에서 확인 → 레이어 캐시·압축 해제 → 레이어 병합
  → 게스트 런타임 주입 → ext4 rootfs 생성 → 커널 페어링 → 별칭 등록
```

레이어는 SHA-256 다이제스트로 캐시되고, 압축을 풀 때마다 다이제스트를 다시 검증합니다. 손상된 캐시 항목은 버리고 다시 받습니다. 화이트아웃(`.wh.*`) 규칙에 따라 레이어를 순서대로 병합해 최종 파일 트리를 만듭니다.

## 왜 컨테이너 이미지가 VM으로 부팅되나요?

컨테이너 이미지에는 PID 1도, DHCP 클라이언트도, 준비 완료를 알릴 방법도 없습니다. Firecrab은 가져오기 과정에서 정적으로 빌드된 busybox를 주입해 이 셋을 모두 대신하게 합니다.

VM이 시작되면 `/proc/1/exe`는 이미지의 엔트리포인트가 아니라 `/etc/firecrab/busybox`를 가리킵니다. 이 busybox가 `/proc`·`/sys`·`/dev`를 마운트하고, DHCP로 주소를 받고, 원래 이미지의 Entrypoint·Cmd·Env·WorkingDir은 `/etc/firecrab/services.d/app`라는 일반 서비스로 등록해 그 뒤에 실행합니다. 즉 이미지의 엔트리포인트는 여전히 실행되지만, 결코 PID 1은 아닙니다. `ls -l /sbin/init`으로는 이미지가 원래 갖고 있던 `systemd` 심볼릭 링크가 그대로 보일 수 있지만, 실제로 그 자리에서 동작하는 것은 주입된 busybox입니다.

## 안전하게 가져옵니다

가져오기 전 모든 레이어 아카이브를 훑어 상대 경로를 벗어나는 멤버, 대상이 없는 링크, 지원하지 않는 특수 파일(문자/블록 디바이스, FIFO)을 걸러냅니다. 손상되었거나 손상된 헤더, 잘린 본문이 있으면 가져오기를 즉시 중단합니다.

레이어와 설정 blob은 캐시에 저장하기 전과 재사용할 때 모두 크기와 SHA-256을 다시 검증합니다. ext4 이미지는 만든 뒤 `tune2fs`로 여유 공간이 남아 있는지 확인한 다음에만 게시되고, 실패하면 부분 파일을 남기지 않습니다.

## 마치며

이제 별도 이미지 빌드 과정 없이, 이미 쓰고 있는 컨테이너 이미지를 그대로 MicroVM 템플릿으로 가져올 수 있습니다. **Images** 화면에서 원하는 OCI 참조를 검사하고, 가져오고, VM을 만들어 보세요.

### 참고

- [OCI images (public-docs)](https://github.com/SteelCrab/firecrab/blob/main/public-docs/oci.md)
