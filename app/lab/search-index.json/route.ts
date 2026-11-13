import { searchIndex } from "../_lib/data";

/** 공개된 용어만 담은 검색 색인. 빌드할 때 한 번 만들어 정적 파일처럼 나간다. */
export const dynamic = "force-static";

export function GET() {
  return Response.json(searchIndex());
}
