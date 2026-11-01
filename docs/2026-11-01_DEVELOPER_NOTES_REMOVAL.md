# 2026-11-01 개발노트 14편 삭제 (소유자 결정)

- 결정(원문): "다 삭제해. 필요없어." / "콘솔에서도 지워야 겠다. 나중에 다시 올리지 뭐" — 실제 개발 과정이었지만 실제임을 증명하는 자료가 없고 AI 문체가 강하다는 판단.
- 지운 것: `app/content/posts/developer-notes-*.json` 14편 + 그 글들이 쓰던 `public/images/developer-notes-*` 33개. 글 원문은 git 기록에 남아 있다(이 커밋의 부모에서 복구 가능).
- 배포: production `dpl_39zb8NDF7xArk54euRpECfxSZN6b`(2026-10-18) 의 소스를 Vercel API 로 그대로 내려받아 위 파일만 빼고 `vercel deploy --prod` → `omniark-783mdtgkg` 가 omniark.co 에 연결됨.
- 확인(라이브): 글 주소 404, 이미지 404, /blog 는 "아직 작성된 글이 없습니다", sitemap 33 → 19개, OmniPDF 웹앱 `index-CckJpLwC.js`·Search Console 확인 태그 그대로.

## 주의: master 는 production 과 다르다
2026-10-18 production 은 어느 git 상태와도 일치하지 않았다(글 14편은 master, OmniPDF 웹앱은 `origin/codex/omnipdf-release-0.8.1` 의 0496769). 이 작업 폴더(master)에서 그대로 배포하면 OmniPDF 가 옛 버전으로 돌아간다.
다음 배포 전에는 production 소스를 기준으로 삼거나, 먼저 master 를 production 과 맞춘다.
