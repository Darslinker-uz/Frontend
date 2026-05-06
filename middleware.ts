import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";

// Static fayl extensionlari — ularni track qilmaymiz.
// .xml saqlanadi (sitemap.xml — bu AI bot eng ko'p ziyorat qiladigan faylimiz).
const STATIC_EXT_RE = /\.(ico|png|jpg|jpeg|webp|gif|svg|css|js|woff|woff2|ttf|otf|eot|map|json|txt)$/i;

function shouldTrack(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return false;
  if (pathname.startsWith("/_next/")) return false;
  if (pathname.startsWith("/admode")) return false;
  if (pathname.startsWith("/asadmin")) return false;
  if (pathname === "/favicon.ico") return false;
  if (STATIC_EXT_RE.test(pathname)) return false;
  return true;
}

export function middleware(request: NextRequest, event: NextFetchEvent) {
  const { pathname } = request.nextUrl;

  if (shouldTrack(pathname)) {
    const userAgent = request.headers.get("user-agent") ?? "";
    const referrer = request.headers.get("referer") ?? "";
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "";
    const sessionId = request.cookies.get("dl_sid")?.value ?? "";

    const origin = request.nextUrl.origin;
    event.waitUntil(
      fetch(`${origin}/api/track-view`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: pathname,
          userAgent,
          referrer,
          ip,
          sessionId,
        }),
        // Track yozish sahifa yuklanishini bloklamasligi kerak
        keepalive: true,
      }).catch(() => {}),
    );
  }

  return NextResponse.next();
}

export const config = {
  // Track barcha public sahifalar uchun — _next va api ishlamaydi (matcher'da kesilgan).
  // shouldTrack qo'shimcha tekshiradi.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
