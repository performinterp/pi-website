import { NextRequest, NextResponse } from "next/server";

const IOS_URL = "https://apps.apple.com/gb/app/pi-events/id6760933712";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=uk.co.performanceinterpreting.app";
const DESKTOP_FALLBACK = "/get-app/choose";

export const dynamic = "force-dynamic";

export function GET(request: NextRequest) {
  const ua = request.headers.get("user-agent") || "";
  const target = resolveStoreUrl(ua, request.nextUrl.origin);
  return NextResponse.redirect(target, 302);
}

function resolveStoreUrl(ua: string, origin: string): string {
  // iOS / iPadOS / iPod
  if (/iPad|iPhone|iPod/.test(ua)) return IOS_URL;

  // Android (Samsung, Pixel, Sony, OnePlus, Huawei, Xiaomi, Motorola, etc.)
  if (/Android/i.test(ua)) return ANDROID_URL;

  // iPadOS 13+ reports as Mac — server-side UA alone can't distinguish from
  // a desktop Mac (maxTouchPoints is client-only), so we fall back to the
  // chooser page. Real iPads with a typical Safari UA already match the
  // iPad regex above; this branch only catches edge cases.
  return `${origin}${DESKTOP_FALLBACK}`;
}
