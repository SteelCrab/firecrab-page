---
slug: microstorage
title: MicroStorage — 왜 디스크를 “고르게” 쓸 수 있어야 하나
authors: [steelcrab]
tags: [devlog, storage, guide]
---

![MicroStorage](/img/microstorage-icon.png)

MicroNetwork가 네트워크를 나누듯, **MicroStorage**는 VM 디스크가 앉을 **물리 위치**를 나눕니다.  
호스트에 이미 마운트된 디렉터리에 이름을 붙인 영구 스토리지 풀이고, VM 생성·재할당 때 그 풀을 고르면 rootfs가 `{풀 경로}/vms/{vm-id}/` 아래에 생깁니다.

AWS로 비유하면 EBS 볼륨 타입·풀을 고르는 일에 가깝고, 파티션을 새로 쪼개 주는 서비스는 아닙니다.

{/* truncate */}

## 문제: 여러 VM을 동시에 켜면 한 디스크가 먼저 숨이 찬다

FireCrab에서 VM을 시작하면 대략 이렇게 디스크를 씁니다.

1. 템플릿 rootfs를 VM 전용 파일로 복사
2. 요청한 `diskGb`까지 늘리기 (`set_len` + `resize2fs`)

VM 한 대는 수 GB 순차 쓰기입니다. 같은 물리 디스크(`data/vms/`가 있는 장치)에 여러 대가 동시에 붙으면:

- `iostat`에서 그 장치 `%util` ≈ 100%
- `w_await`가 수백 ms로 튀고
- 대시보드에는 “디스크 준비” 단계에서 오래 멈춘 것처럼 보입니다

하드웨어(NVMe)가 느린 게 아니라 **한 큐에 일이 몰린 것**입니다.  
네트워크를 MicroNetwork로 나눈 것처럼, **디스크 경로도 나눌 수 있어야** 합니다.

## 설계 원칙 (MicroNetwork와 같은 결)

| 원칙 | 내용 |
| --- | --- |
| 기본값은 그대로 | 풀을 안 고르면 예전과 같이 `data/vms/{id}/` (root id `default`) |
| 사용자는 path를 자유 입력하지 않음 | 등록된 id만 고른다 → path traversal / 임의 경로 쓰기 방지 |
| 등록은 운영자 행위 | MicroStorage CRUD 또는 env `FIRECRAB_STORAGE_ROOTS` |
| 용량은 생성·할당 시점에 확인 | `statvfs`로 여유 공간이 `diskGb` 미만이면 **복사 전에** 거부 |
| 파티션 “생성”은 안 함 | 마운트만 발견·등록. `fdisk` / `mkfs`는 OS 영역 |

## 무엇이 생겼나

### 1. 선택 가능한 저장 위치

저장 위치는 세 갈래에서 모입니다.

- **default** — cwd 기준 `data/` (기존 레이아웃)
- **env** — `FIRECRAB_STORAGE_ROOTS=id=path:id2=path2`
- **MicroStorage** — DB에 이름+절대경로로 등록한 풀 (API/UI)

통합 목록:

```http
GET /api/storage
```

응답 예:

```json
[
  {
    "id": "default",
    "name": "default",
    "path": "data",
    "availableGib": 120,
    "totalGib": 500,
    "kind": "default"
  },
  {
    "id": "a1b2…",
    "name": "nvme1",
    "path": "/mnt/disk2",
    "availableGib": 800,
    "totalGib": 1000,
    "kind": "micro_storage"
  }
]
```

### 2. MicroStorage 서비스 (CRUD)

| 메서드 | 경로 | 역할 |
| --- | --- | --- |
| `GET` | `/api/micro-storages` | 풀 목록 + 여유 공간 |
| `POST` | `/api/micro-storages` | `{ "name", "path" }` 등록 (절대 경로, 없으면 디렉터리 생성) |
| `GET` | `/api/micro-storages/{id}` | 상세 + 이 풀을 쓰는 VM 목록 |
| `DELETE` | `/api/micro-storages/{id}` | 삭제 (VM이 물려 있으면 **409**) |

대시보드 헤더의 **MicroStorage** 버튼에서 등록·목록·상세·삭제를 할 수 있습니다.

### 3. 생성 시 할당

`POST /api/vms`에 선택 필드 `storageRoot`를 넣을 수 있습니다.

```json
{
  "name": "worker-1",
  "template": "alpine-3.24",
  "cpu": 1,
  "ram": 512,
  "diskGb": 2,
  "storageRoot": "<default | env-id | micro-storage-uuid>"
}
```

- 생략 → 첫 번째 root (`default` 또는 env의 첫 id)
- 없는 id / 여유 공간 부족 → `400`, 필드 `storageRoot`

디스크 실제 경로:

```text
{storageRoot의 path}/vms/{vm-id}/rootfs.ext4
```

### 4. 수동 재할당

이미 만든 VM이 아직 디스크를 쓰지 않았다면(첫 start 전, 또는 rootfs가 없는 상태) 옮길 수 있습니다.

```http
PUT /api/vms/{id}/storage
{ "storageRoot": "<id>" }
```

- VM이 `created` / `stopped` / `error`일 때만
- **이미 rootfs 파일이 있으면 409** — 수 GB 파일을 조용히 옮기지 않습니다 (삭제 후 재생성 또는 유지)
- 대시보드: VM 상세 → 편집 → **MicroStorage** select → 저장

### 5. 파티션 — “가능하면”의 의미

| 되는 것 | 안 되는 것 |
| --- | --- |
| 이미 마운트된 파티션/파일시스템 **목록** | 파티션 테이블 생성 (`fdisk`) |
| 마운트 포인트를 MicroStorage path로 **등록** | `mkfs`, 포맷, 마운트 자체 |
| 여유 공간 표시 | 게스트 안에 파티션 나누기 |

```http
GET /api/storage/devices
```

`/proc/mounts`(가능하면 `lsblk`)로 실디스크 마운트만 골라 줍니다. UI에서 행을 고르면 path가 채워집니다.

즉 **파티션은 OS에서 먼저 만들고 마운트**하고, FireCrab은 그 위에 **이름 붙인 풀**을 얹는 계층입니다.  
EBS를 “만들고” attach 하는 AWS와 달리, 로컬 호스트에서는 **이미 있는 블록 장치 활용**이 안전하고 권한 모델과도 맞습니다.

## 왜 이렇게 나눴나

1. **권한** — API는 보통 비특권/`firecrab` 유저. 파티션 조작은 root·파괴적 작업입니다.
2. **신뢰 경계** — 클라이언트가 임의 path를 넘기면 host 전역 쓰기가 됩니다. “등록된 풀 id만”이 같은 이유입니다.
3. **운영 현실** — 디스크 추가는 `mkfs`보다 “새 디스크 마운트 후 풀 등록” 쪽이 훨씬 흔합니다.
4. **동시 시작** — 풀만 나누면 start 시 I/O가 장치별로 갈라집니다. 그게 이 기능의 본래 목적입니다.

## 쓰는 흐름 (실무)

```text
1. (호스트) 두 번째 디스크를 /mnt/disk2 에 마운트
2. 대시보드 MicroStorage → name: disk2, path: /mnt/disk2
   또는 devices 표에서 선택
3. VM 생성 시 저장 위치 = disk2
4. 여러 대를 disk2 / default 에 나눠 동시 start
5. iostat 으로 장치 util 이 나뉘는지 확인
```

env만 쓸 때도 동일 효과입니다.

```sh
export FIRECRAB_STORAGE_ROOTS="local=data:fast=/mnt/disk2"
```

## API 한눈에

| 용도 | API |
| --- | --- |
| 선택 목록 (생성·할당 폼) | `GET /api/storage` |
| 마운트 파티션 탐색 | `GET /api/storage/devices` |
| 풀 관리 | `GET`/`POST` `/api/micro-storages`, `GET`/`DELETE` `…/{id}` |
| 생성 시 지정 | `POST /api/vms` · `storageRoot` |
| 수동 재할당 | `PUT /api/vms/{id}/storage` |

## 다음에 올 수 있는 것 (아직 아님)

- 이미 있는 rootfs를 다른 풀로 **복사/이전** (지금은 디스크 있으면 재할당 거부)
- 풀별 쿼터·예약
- 스냅샷 세대 ledger와 연동
- 게스트 내부 디스크 파티션 (별 문제 영역)

## 정리

MicroNetwork가 “어느 네트워크에 붙일지”라면,  
MicroStorage는 **“어느 물리 디스크에 디스크 파일을 둘지”**입니다.

- 서비스로 등록하고  
- 생성 시·상세에서 수동으로 고르고  
- 파티션은 **호스트가 마운트한 것**을 골라 붙입니다  

동시에 여러 MicroVM을 돌리는 호스트에서, 병목이 “코드”가 아니라 “한 디스크”였다는 걸 인정하고 나눠 쓰는 장치입니다.
