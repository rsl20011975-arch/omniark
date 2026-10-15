# Developer Notes 작업지시서 착공 게이트

작성일: 2026-10-15

## 벤치마크 3개

### OpenAI Codex Prompting Guide

URL: https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide

- 잘하는 것: 저장소 루트부터 현재 작업 폴더까지의 `AGENTS.md`를 순서대로 적용하는 실제 작동 방식을 설명한다.
- 가져올 것: `D:\omniark\AGENTS.md`를 자동 적용되는 짧은 입구로 사용한다.

### AGENTS.md Specification v3.0

URL: https://github.com/TechSpokes/agency-specifications-files-agents-md/blob/main/SPECIFICATION.md

- 잘하는 것: 부분적으로 읽혀도 중요한 규칙이 살아남도록 우선순위, 필수 문서, 금지선을 단순한 Markdown으로 정리한다.
- 가져올 것: 강제 규칙은 짧게 유지하고 상세 설명은 별도 헌장으로 연결한다.

### Diátaxis

URL: https://www.diataxis.fr/

- 잘하는 것: 학습, 문제 해결, 사실 조회, 개념 이해를 서로 다른 독자 요구로 구분한다.
- 가져올 것: 개발자 노트를 회고문 하나로 고정하지 않고 사건에 맞는 교육 형식을 선택한다.

## 시안 A — 모든 규칙을 루트 AGENTS.md에 넣기

```md
# OMNIARK Developer Notes

## Mission
실제 개발 사건만 사용한다.

## Evidence
실행 결과, 기록, 작성자 경험, 외부 문서, 추론을 구분한다.

## Writing
초급·중급·고급 독자 층을 한 글 안에서 나눈다.

## Visuals
증거, 설명, 실행 카드로 구성한다.

## Publishing
초안에서 멈추고 승인 후 공개한다.
```

장점은 한 파일만 읽으면 된다는 점이다. 단점은 규칙이 길어질수록 Next.js 지시와 편집 기준이 섞이고 중요한 금지선이 묻힌다는 점이다.

## 시안 B — 짧은 AGENTS.md와 상세 헌장 분리

```text
D:\omniark\AGENTS.md
  ├─ 반드시 읽을 문서
  ├─ 절대 금지선
  ├─ 10단계 작업 루프
  └─ 완료의 정의

D:\omniark\docs\DEVELOPER_NOTES_EDITORIAL_CHARTER.md
  ├─ 목적과 독자
  ├─ 근거 등급
  ├─ 교육·분량·시각 기준
  ├─ 검색 구조
  ├─ CMS·승인 경계
  └─ 발행 대기 완료 조건
```

자동 적용과 사람의 유지보수를 함께 만족한다. 이번 구현은 시안 B를 채택한다.

## 시안 C — 별도 에이전트 스킬로만 관리

```yaml
name: omniark-developer-notes
trigger: OMNIARK 개발자 노트 작성·편집·발행 준비
resources:
  - editorial-charter.md
  - visual-system.md
```

프로젝트 밖에서도 쓸 수 있지만, 스킬이 실행되지 않은 도구나 사람이 기준을 놓칠 수 있다. 현재는 저장소 문서를 정본으로 두고 필요할 때 스킬을 추가하는 편이 안전하다.

## 합격선 5줄

- 목표: 다음 세션이 이전 대화를 다시 묻지 않고 같은 편집·검증 기준으로 작업한다.
- 누가 볼 것: OMNIARK 운영자와 이 저장소에서 작업하는 AI 에이전트다.
- 만들 것: 루트 자동 지시서 1개와 상세 편집헌장 1개다.
- 성공: 실제 사건, 교육, 시각, 검색, 초안·발행 경계가 모두 문서에 있고 루트 지시서가 헌장을 필수 문서로 연결한다.
- 실패: 대화에서 합의한 핵심 기준이 세션 기억에만 남거나, 초안 작성과 공개 발행이 같은 권한으로 취급된다.
