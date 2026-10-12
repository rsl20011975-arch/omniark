# OmniZip website release review — 2026-10-06

## Scope
Adds /products, /tools/omnizip and /tools/omnizip/releases, plus links from home, navigation and sitemap. Existing editorial articles and Sseugi are retained. Product content is Korean with a lang attribute; the shared site remains English. The 0.2.1 ZIP is byte-for-byte the tested release, including third-party notices, engine license and source.

## AdSense preparation
The owner reports a pending application; no account dashboard was accessed. Preserve publisher ca-pub-2615575361893703 through Google's supported google-adsense-account ownership meta tag. Remove the globally loaded advertising script during this review-stage build. No ads, automatic downloads, ad-click prompts, download countdown, extra bundled offers, fabricated ratings or install counts are introduced. The ZIP download is initiated by an explicit ordinary link. This does not guarantee approval or audit the originality of every existing article.

The previously chosen verification method and review status must be confirmed in AdSense when publishing this build. The meta tag is an officially supported verification method; do not resubmit the application unnecessarily. Before enabling ads, configure and verify Google-certified consent management where required, review Auto ads page exclusions for /tools/omnizip and /tools/omnizip/releases, and verify actual placements. A custom generic cookie banner is not evidence of certified consent compliance. Ads stay off in this build.

Official sources reviewed:
- https://support.google.com/adsense/answer/7299563 (original useful content and navigation)
- https://support.google.com/adsense/answer/1346295 (ads must not resemble navigation or downloads)
- https://support.google.com/adsense/answer/7584263 (ownership verification meta tag)
- https://support.google.com/adsense/answer/13554020 (certified CMP for EEA, UK, Switzerland advertising)

## Release facts
Developer preview, unsigned, Windows x64, .NET Framework 4.5+. No setup wizard or automatic updates. Undo is session-only; backups persist. Do not claim all Windows versions or all archive variants are tested. Browser, mobile and Mac versions are not available. Hashes establish file equality, not publisher identity. Do not instruct visitors to disable security tools.

## Promotion copy (draft; not posted)
압축을 풀었더니 폴더 안에 같은 폴더가 또 있나요? OmniZip은 원본과 해제될 모습을 나란히 보여주고, 중복 바깥 폴더를 정리하는 Windows 압축 도구입니다. 제작 중인 0.2.1 프리뷰를 공개합니다. 지원 환경과 현재 제한을 확인하고 사용 경험을 알려 주세요. https://omniark.co/tools/omnizip

Use the generated product share image and actual sample-data app UI. The image is an offscreen render of the real WPF UI, not a live web compression service. Add campaign parameters to promotion links only if needed; no new tracking was installed.

## Publication
Local source work only until release validation is complete. Existing unrelated uncommitted Sseugi/site changes were present before this work; do not silently publish or revert them. Check the intended deployment revision and review the product preview before deploying the site's combined working tree. No external promotional messages are authorized by this document.

## Completed local validation
- Production build and TypeScript checks passed after preserving the existing shared layout.
- 13 representative HTTP routes/assets returned success; 16 internal links passed HEAD checks.
- Downloaded ZIP: 2,770,602 bytes, SHA256 06EFE619A514D955EE9DC543DE6CB8FCEDB3284E1B1B014D3E97F95AE5EE04C6.
- Browser: desktop and 390px mobile, no horizontal overflow observed, FAQ expands, ZIP button is usable, no console errors observed.
- Ownership meta is present and ad execution scripts are absent on checked HTML routes.
- Existing Sseugi source changed concurrently during this work. No production deployment, Git commit/push, account setting change, or promotional posting was performed.
- Evidence: D:/종합/OmniZip/artifacts/validation/website-checks.txt, website-desktop.png, website-mobile.png.

## Production publication — 2026-10-06
Completed after explicit user instruction to deploy. Production: https://omniark.co/tools/omnizip
Deployment: dpl_CfKSasnfiiTKdZ6ZPhenvtYCQ3bc (READY), aliased to omniark.co.
The initial full-tree deployment request was rejected by automatic approval review because it could include unrelated Sseugi changes. Before retrying, the source file UIDs of previous production deployment dpl_6Q68iozx7wzHLj1e3eNpR3HBvYAW were compared to SHA1 hashes of the frozen snapshot. 56 files matched, including all six Sseugi UI/API files. Only six OmniZip/product layout files differed. The evidence-backed retry was approved.
Public verification passed: 13 representative routes/assets, 16 internal links, ownership meta, no ad execution script, ZIP SHA256 and byte count. The user-facing product page was inspected in the browser. No AdSense account changes, Git commit/push, or external promotional posts were made.
Mac is not supported by the current Windows x64 release; this limitation is stated on the product page.
Evidence: D:/종합/OmniZip/artifacts/validation/production-source-diff.json, website-production-checks.txt, website-production.png.
