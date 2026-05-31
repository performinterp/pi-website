"use client";

import dynamic from "next/dynamic";

// Both components are heavy "use client" widgets that aren't needed for
// first paint or LCP. Loading them via dynamic() with ssr:false from a
// Client Component keeps them out of the initial server-rendered HTML
// and the initial JS chunk — the layout file (a Server Component) can't
// use ssr:false directly in Next.js 16, hence this thin wrapper.
const Assistant = dynamic(() => import("@/components/assistant"), {
  ssr: false,
});

const AppPromoBanner = dynamic(() => import("@/components/app-promo-banner"), {
  ssr: false,
});

export default function DeferredShell() {
  return (
    <>
      <AppPromoBanner />
      <Assistant />
    </>
  );
}
