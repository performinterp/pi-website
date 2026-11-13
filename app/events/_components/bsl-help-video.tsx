"use client";

// BSL & ISL "how to search" intro on /events. The player lives in
// components/signed-clip.tsx so Easy Read summaries can reuse it.
import SignedClip from "@/components/signed-clip";

export default function BslHelpVideo() {
  return <SignedClip videoKey="search" label="How to find your event" />;
}
