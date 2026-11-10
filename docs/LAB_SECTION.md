# OMNIARK Visual Lab (`/lab`) 구역

시각 용어 사전. 주소는 `omniark.co/lab/` → `/lab/<분야>` → `/lab/<분야>/<용어>` 세 단계다. 용어 하나가 한 페이지이고, 데모 코드는 그 페이지에 들어갈 때만 내려받는다.

## 원본은 이 저장소가 아니다
- 용어·분야·지시문·응용 팁의 **원본은 `D:\visual-lab`**(`lab-site/tools/data.py`, `lab-site/source/`)이다.
- 이 저장소의 `app/lab/_content/`, `app/lab/_demos/art/`, `app/lab/lab.css`, `public/lab/posters/` 는 거기서 **만들어진 사본**이다. 여기서 직접 고치지 않는다.
  - 내용·데모: `python lab-site/tools/export_content.py D:/omniark-lab/app/lab`
  - 스타일: `python lab-site/tools/port_css.py D:/omniark-lab/app/lab/lab.css`
  - 목록 카드 대표 이미지: `python lab-site/tools/make_posters.py D:/omniark-lab/public/lab/posters`
  - 데모 코드 추출(아티팩트 → `lab-site/source/extracted`): `node lab-site/tools/extract_demos.mjs lab-site/source/motion-dictionary-artifact-2026-11-07.html lab-site/source/extracted`
- 스타일은 모두 `.lab-root` 아래로 가둔다. 옴니아크 전역 `globals.css` 의 `h1·h2·h3·p·a:hover·main` 규칙이 새어 들어오는 것도 같은 변환 파일에서 막는다(다크 테마에서 제목이 검정으로 고정돼 안 보이던 결함을 실제 사이트에서 측정해 잡았다).

## 공개 규칙
- 데모·지시문이 있고 **응용 팁을 실제로 돌려 확인한** 용어만 `status: "published"` 로 나간다(`data.py` 의 `PUBLISHED`). 나머지는 `planned` 이고 **페이지도, 목록도, 검색도, sitemap 도 없다**(주소는 404). 지금 공개: 11개, 준비 중: 여백(데모 없음).
- 공개된 용어가 하나도 없는 분야는 허브에 "준비 중"으로만 보이고 링크가 아니다.
- **검색엔진 공개 여부는 `app/lab/_lib/config.ts` 의 `LAB_INDEXABLE`**(기본 `false`). `false` 면 모든 `/lab` 페이지가 `noindex` 이고 `sitemap.xml` 에도 없다. 용어가 충분히 쌓이고 드림님이 열기로 하면 `true` 로 바꾼다.

## 응용 팁
- 용어마다 2개. 초보가 막히는 말로 시작해서(상황) → 지시문의 어느 부분을 어떻게 바꾸는지 → 그러면 달라지는 것을 보여 주고, **‘이 팁 적용해서 보기’ 를 누르면 같은 데모가 그 값으로 바뀐다.**
- 팁은 `lab-site/source/tips.json` 에 적는다. 팁마다 `patches`(데모 코드에서 바꿀 값)가 있고, 추출 도구가 그 값만 바꾼 데모(`dNN_<팁>.js`)를 만든다. **찾는 값이 없거나 여러 곳이면 만들다 멈춘다**(조용히 틀어지지 않게).
- ‘확인’ 표시는 `lab-site/tools/verify_tips.py` 로 원본 데모와 팁 적용 데모를 같은 시각의 장면으로 나란히 렌더해 눈으로 보고 픽셀 차이를 잰 뒤에만 단다. AI가 같은 결과를 만드는지는 이 확인에 들어 있지 않다(페이지에도 그렇게 적혀 있다).

## 용어를 하나 더하는 법
1. `data.py` 의 `TERMS` 에 줄을 더하고(느낌 키워드는 `KEYWORDS`).
2. 데모가 있으면 아티팩트 원본에 두고 `DEMO_OF` 에 연결, 팁은 `tips.json` 에 적고 `verify_tips.py` 로 확인.
3. 위 내보내기 명령을 돌린다. 데모 불러오기 표(`_demos/art/index.ts`)도 자동으로 만들어진다.

## 알려진 것
- 입문 코스·"이 용어가 나온 편" 링크는 `/blog/<slug>` 이다. 이 저장소 사본에는 해당 글이 없어서 로컬에서는 404 이고, 글이 들어 있는 소스로 배포하면 정상이다.
- 글꼴을 외부에서 불러온다: Wanted Sans(jsDelivr)·Instrument Serif(Google Fonts)는 모든 /lab 페이지, 데모 글꼴(Black Han Sans·IBM Plex Sans KR·JetBrains Mono, Google Fonts)은 데모 페이지에서만. 개인정보·쿠키 문서에 제3자 요청 안내가 필요한지는 확인하지 않았다.
- 검색은 공개된 용어만 담은 `/lab/search-index.json`(정적)을 처음 입력할 때 불러와 브라우저에서 찾는다.
- 상단 공통 메뉴(`StudioShell`)에는 아직 Visual Lab 링크를 넣지 않았다. 배포·메뉴 노출은 승인 뒤에 한다.
- `_demos/art/*.js` 는 아티팩트 코드를 그대로 가져온 파일이라 타입·린트 검사를 끈다(맨 위 주석 참고).

## 배포 전에 알아야 할 것 (2026-11-10 점검)
- **이 브랜치(`claude/lab-section`, 작업 폴더 `D:\omniark-lab`)를 그대로 배포하면 안 된다.** 이 브랜치는 `master` 에서 갈라져 나와서 라이브 사이트와 다른 코드(개발 중인 변경)와, 라이브에 올라가 있는 개발 노트 글 4개가 없는 상태다.
- 라이브 사이트는 `claude/blog-lab` 기반이고, 커밋되지 않은 파일(글 003 릴 3개, OmniPDF 앱 조각 151개)에도 의존한다. 깨끗한 체크아웃으로 배포하면 이것들이 조용히 빠지거나 옛 버전으로 되돌아간다.
- 그래서 **배포 후보 폴더 `D:\omniark-lab-candidate`** 를 따로 만들었다: 라이브와 대응하는 폴더(`D:\omniark-blog`)를 복사하고 `/lab` 파일만 얹은 것이다. Vercel 의 라이브 배포(dpl_9DoX2hbWL1aDewtgo3y54u1eiq1d) 파일 목록과 해시를 하나씩 대조했다: 라이브에만 있는 파일 0개, 내용이 바뀐 기존 파일은 `app/sitemap.ts` 하나뿐.
- `/lab` 데이터를 고친 뒤 배포하려면: 이 브랜치에서 내보내기 → 커밋 → 후보 폴더의 `app/lab`·`public/lab/posters`·`docs/LAB_SECTION.md` 를 교체 → 후보에서 빌드·점검 → 배포 순서로 한다.
