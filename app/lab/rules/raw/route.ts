import { rulesText } from "../../_lib/catalog";

/** 새 AI 세션이 주소 하나로 읽을 수 있는 순수 글(UTF-8). */
export const dynamic = "force-static";

export function GET() {
  return new Response(rulesText(), { headers: { "content-type": "text/plain; charset=utf-8" } });
}
