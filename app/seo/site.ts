export const SITE_NAME = "OMNIARK";
export const SITE_URL = "https://omniark.co";

export function absoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}
