---
slug: contributing
title: "기여를 환영합니다 — firecrab CONTRIBUTING 안내"
authors: [steelcrab]
tags: [guide, devlog]
---

Firecracker 기반 단일 호스트 microVM 플랫폼 **firecrab**에 기여하는 방법을 정리했습니다.
문서 오타부터 설치 실패 제보까지, 작은 참여도 환영합니다.

{/* truncate */}

## 개발자의 말

**기여를 환영합니다.**
누구나 쉽게 참여할 수 있도록 가능한 한 많은 정보를 공개합니다. 문서 오타 수정, 작은 버그 제보처럼 사소한 작업도 환영합니다. 최종 검토와 병합은 SteelCrab이 진행합니다.

**보안과 안정성을 우선합니다.**
이 프로젝트는 구조가 복잡하고, 기업 환경에서도 쓸 수 있는 기능을 목표로 합니다. 그래서 기능 추가보다 보안성·안정성을 더 중요하게 봅니다.

**설치 실패도 이슈로 남겨 주세요.**
`install.sh`로 설치하다 중간에 실패해도 “내 환경만의 문제”로 넘기지 말고, 가능하면 Issue에 올려 주세요. 재현 환경·로그·어느 단계에서 막혔는지만 있어도 큰 도움이 됩니다.

**서로를 존중해 주세요.**
기여자 간에는 예의를 지켜 주세요. 부정적인 표현보다는 긍정적인 말과 가벼운 이모지를 권장합니다. 🙏

**겹치는 기여는 함께 맞춥니다.**
비슷한 기능을 여러 분이 작업 중이면, SteelCrab이 직접 통합을 조율하고 함께 기여한 결과로 남기는 것을 목표로 합니다.

**유지보수가 잠시 끊겨도 괜찮습니다.**
기여자의 사정으로 PR 유지가 어려워지면, 필요 시 유지자가 이어서 다듬고 통합할 수 있습니다. 개인적인 사정을 이해하며, 함께해 주신 것만으로도 큰 도움이라고 생각합니다. 커밋·PR이 잠시 멈춰 있어도 기여가 무의미해지지 않습니다.

---

## firecrab이 다루는 영역

| 영역 | 위치 |
|---|---|
| REST API, VM 생명주기, 이미지, SQLite | `firecrab-api/` |
| 공유 요청/응답 타입 | `firecrab-api-types/` |
| API ↔ helper Unix 소켓 프로토콜 | `firecrab-helper-protocol/` |
| 특권 호스트 네트워킹 | `firecrab-net-helper/` |
| 브라우저 대시보드 | `firecrab-frontend/` |
| 설치기·doctor | `install.sh`, `scripts/` |

호스트 권한은 작게 유지합니다. API는 비특권, 네트워크 capability는 `firecrab-net-helper`만 가집니다.

## 소스에서 바로 띄우기

API는 저장소 루트에서 실행합니다. 터미널 세 개면 됩니다.

```sh
# 1) 특권 네트워크 helper
./scripts/dev-net-helper.sh

# 2) API
cargo run -p firecrab-api

# 3) 대시보드 → http://localhost:8080/
npm install --prefix firecrab-frontend
npm run dev --prefix firecrab-frontend
```

## PR 전에 돌리면 좋은 검사

```sh
cargo fmt --all -- --check
cargo clippy --workspace --all-targets
cargo test --workspace --locked

npm ci --prefix firecrab-frontend
npm run lint --prefix firecrab-frontend
npm run build --prefix firecrab-frontend

python3 scripts/check-doc-links.py
shellcheck install.sh scripts/firecrab-doctor.sh
```

## 보안 기본값

- 기본 bind는 루프백(`127.0.0.1:3000`)입니다. 인증·멀티 테넌트 격리를 가정하지 마세요.
- API에 호스트 권한을 새로 주기보다 helper 프로토콜 확장을 선호합니다.
- 민감한 보안 이슈는 공개 Issue 대신 유지자에게 비공개로 보고해 주세요.

## 시작하기

1. [SteelCrab/firecrab](https://github.com/SteelCrab/firecrab)을 fork 하거나 브랜치를 만듭니다.
2. 가능하면 **한 가지 관심사**에 맞춘 PR을 열어 주세요.
3. 무엇을 왜 바꿨는지 적고, 관련 Issue가 있으면 링크합니다.
4. 자세한 절차는 저장소의 [CONTRIBUTING.md](https://github.com/SteelCrab/firecrab/blob/main/CONTRIBUTING.md) · [한국어](https://github.com/SteelCrab/firecrab/blob/main/CONTRIBUTING.ko.md)를 참고하세요.

설치, 아키텍처, API 계약은 사이트 [Docs](/docs)와 GitHub 문서에서도 이어집니다.  
작은 PR 하나, 설치 실패 로그 한 줄도 firecrab을 더 단단하게 만듭니다. 함께해 주세요. 🦀
