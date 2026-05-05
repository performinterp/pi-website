"use client";

import { useEffect, useState } from "react";
import AppStoreButtons from "@/components/app-store-buttons";

const IOS_URL = "https://apps.apple.com/gb/app/pi-events/id6760933712";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=uk.co.performanceinterpreting.app";

export default function GetAppPage() {
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent || navigator.vendor || "";

    // iOS / iPadOS / iPod
    if (/iPad|iPhone|iPod/.test(ua) && !("MSStream" in window)) {
      window.location.replace(IOS_URL);
      return;
    }

    // iPadOS 13+ reports as Mac with touch — still iPhone/iPad
    if (
      /Macintosh/.test(ua) &&
      typeof navigator.maxTouchPoints === "number" &&
      navigator.maxTouchPoints > 1
    ) {
      window.location.replace(IOS_URL);
      return;
    }

    // Android (Samsung, Pixel, Sony, OnePlus, Huawei, Xiaomi, Motorola, etc.)
    if (/android/i.test(ua)) {
      window.location.replace(ANDROID_URL);
      return;
    }

    // Desktop or unrecognised — show fallback chooser
    setShowFallback(true);
  }, []);

  if (!showFallback) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center py-16">
        <p className="text-pi-ink/60">Opening your app store…</p>
      </main>
    );
  }

  return (
    <main className="section-padding flex min-h-[60vh] items-center justify-center py-16">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-pi-gold-dark">
          The PI Events App
        </p>
        <h1 className="mt-3 font-display text-3xl text-pi-ink md:text-4xl">
          Get PI Events on your phone
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-pi-ink/70">
          Tap the right button for your phone.
        </p>
        <div className="mt-8 flex justify-center">
          <AppStoreButtons variant="light" />
        </div>
        <p className="mx-auto mt-8 max-w-xl text-sm leading-relaxed text-pi-ink/60">
          The Google Play Store is already installed on Samsung, Sony, OnePlus,
          Huawei, Motorola, Xiaomi and Google Pixel phones — no need to download it first.
        </p>
      </div>
    </main>
  );
}
