# OMNIARK Visual Lab (`/lab`) 구역

시각 용어 사전. 주소는 `omniark.co/lab/` → `/lab/<분야>` → `/lab/<분야>/<용어>` 세 단계다. 용어 하나가 한 페이지이고, 데모 코드는 그 페이지에 들어갈 때만 내려받는다.

## 원본은 이 저장소가 아니다
- 용어·분야·지시문의 **원본은 `D:\visual-lab`**(`lab-site/tools/data.py`)이다.
- `app/lab/_content/` 와 `app/lab/lab.css` 는 거기서 **만들어진 사본**이다. 여기서 직접 고치지 않는다.
  - 내용: `python lab-site/tools/export_content.py D:/omniark/app/lab/_content`
  - 스타일: `python lab-site/tools/port_css.py D:/omniark/app/lab/lab.css`
- 스타일은 모두 `.lab-root` 아래로 가둬 놓았다. 옴니아크 전역 `globals.css` 의 `h1·h2·h3·p·a:hover·main` 규칙이 새어 들어오는 것도 같은 파일에서 막는다(다크 테마에서 제목이 검정으로 고정돼 안 보이던 결함을 실제 사이트에서 측정해 잡았다).

## 공개 규칙
- 데모와 지시문을 직접 시험한 용어만 `status: "published"` 로 나간다(`data.py` 의 `PUBLISHED`). 나머지는 `planned` 이고 **페이지도, 목록도, 검색도, sitemap 도 없다**(주소는 404).
- 공개된 용어가 하나도 없는 분야는 허브에 "준비 중"으로만 보이고 링크가 아니다.
- **검색엔진 공개 여부는 `app/lab/_lib/config.ts` 의 `LAB_INDEXABLE`**(기본 `false`). `false` 면 모든 `/lab` 페이지가 `noindex` 이고 `sitemap.xml` 에도 없다. 용어가 충분히 쌓이고 드림님이 열기로 하면 `true` 로 바꾼다.

## 용어를 하나 더하는 법
1. `data.py` 의 `TERMS` 에 줄을 더하고(느낌 키워드는 `KEYWORDS`), 공개할 용어는 `PUBLISHED` 와 `DETAIL` 에 지시문·확인 목록·근거를 적는다.
2. 데모가 있으면 `app/lab/_demos/<이름>.tsx` 를 만들고 `app/lab/_components/DemoSlot.tsx` 의 `DEMOS` 에 한 줄을 더한다(`next/dynamic` 지연 로딩).
3. 위 두 내보내기 명령을 돌린다.

## 알려진 것
- 입문 코스·"이 용어가 나온 편" 링크는 `/blog/<slug>` 이다. 이 저장소 사본에는 해당 글이 없어서 로컬에서는 404 이고, 글이 들어 있는 소스로 배포하면 정상이다.
- 글꼴(Wanted Sans: jsDelivr, Instrument Serif: Google Fonts)을 외부에서 불러온다. 개인정보·쿠키 문서에 제3자 요청 안내가 필요한지는 확인하지 않았다.
- 검색은 공개된 용어만 담은 `/lab/search-index.json`(정적)을 처음 입력할 때 불러와 브라우저에서 찾는다.
- 상단 공통 메뉴(`StudioShell`)에는 아직 Visual Lab 링크를 넣지 않았다. 배포·메뉴 노출은 승인 뒤에 한다.
