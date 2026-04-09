"use client";

import { useState, useRef } from "react";
import { Camera, Upload, CheckCircle, X, Loader2 } from "lucide-react";

type Stage = "idle" | "uploading" | "success" | "error";

export default function VideoFeedback() {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  async function handleFile(file: File) {
    if (file.size > MAX_SIZE) {
      setErrorMsg("Video is too large (max 50MB). Please record a shorter video.");
      setStage("error");
      return;
    }

    setStage("uploading");
    setProgress(10);

    try {
      setProgress(30);

      const response = await fetch(
        "https://pi-feedback-uploads.vercel.app/api/upload",
        {
          method: "POST",
          headers: { "Content-Type": file.type || "video/mp4" },
          body: file,
        }
      );

      setProgress(80);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Upload failed");
      }

      setProgress(100);

      // Notify PI via the website's own API
      const data = await response.json().catch(() => ({}));
      await fetch("/api/video-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: data.url }),
      }).catch(() => {});

      setStage("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
      setStage("error");
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  function reset() {
    setStage("idle");
    setProgress(0);
    setErrorMsg("");
  }

  if (stage === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center">
        <CheckCircle size={40} className="text-green-400" />
        <p className="font-display text-xl text-white">Thank you!</p>
        <p className="text-base text-white/70">
          Your video has been received. It means a lot and helps us improve access for everyone.
        </p>
        <button
          onClick={reset}
          className="mt-4 text-sm font-semibold text-pi-accent transition-colors hover:text-white"
        >
          Send another
        </button>
      </div>
    );
  }

  if (stage === "uploading") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-pi-accent/20 bg-pi-accent/5 p-8 text-center">
        <Loader2 size={32} className="animate-spin text-pi-accent" />
        <p className="text-base font-semibold text-white">Uploading your video...</p>
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-pi-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-white/60">Please keep this page open</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-8 text-center">
        <X size={32} className="text-red-400" />
        <p className="text-base font-semibold text-white">{errorMsg}</p>
        <button
          onClick={reset}
          className="mt-2 text-sm font-semibold text-pi-accent transition-colors hover:text-white"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-white/20 bg-white/[0.02] p-8 text-center transition-colors hover:border-pi-accent/30 hover:bg-pi-accent/5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pi-accent/10">
        <Camera size={28} className="text-pi-accent" />
      </div>
      <p className="font-display text-xl text-white">
        Record a video in BSL or ISL
      </p>
      <p className="max-w-sm text-base text-white/70">
        Share your experience in sign language. Your feedback goes straight to PI and helps us improve access for everyone.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110"
        >
          <Camera size={16} />
          Record video
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:border-pi-accent/30 hover:bg-pi-accent/10">
          <Upload size={16} />
          Upload file
          <input
            type="file"
            accept="video/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
      {/* Hidden input for camera capture */}
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        capture="user"
        className="hidden"
        onChange={handleChange}
      />
      <p className="text-xs text-white/40">Max 50MB. MP4, MOV, WebM supported.</p>
    </div>
  );
}
