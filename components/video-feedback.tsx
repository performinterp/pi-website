"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Upload, CheckCircle, X, Loader2 } from "lucide-react";

type Stage = "idle" | "recording" | "uploading" | "success" | "error";

const MAX_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_RECORD_MS = 5 * 60 * 1000; // 5 minutes safety cap

function formatMs(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Desktop = has the recording APIs AND isn't a coarse-pointer (touch-primary)
// device. On phones/tablets we'd rather use the native camera app via the
// hidden file input — better orientation/focus handling and no need to grant
// site-level camera permission.
function canRecordInBrowser(): boolean {
  if (typeof window === "undefined") return false;
  if (!navigator.mediaDevices?.getUserMedia) return false;
  if (typeof MediaRecorder === "undefined") return false;
  if (window.matchMedia("(pointer: coarse)").matches) return false;
  return true;
}

export default function VideoFeedback() {
  const [stage, setStage] = useState<Stage>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [recordingMs, setRecordingMs] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const tickRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);

  useEffect(() => {
    return () => stopStream();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function stopStream() {
    if (tickRef.current) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

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

  async function handleRecordClick() {
    if (!canRecordInBrowser()) {
      // Mobile / unsupported → use the native camera app via capture input.
      inputRef.current?.click();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      cancelledRef.current = false;
      chunksRef.current = [];
      setRecordingMs(0);
      setStage("recording");

      // Attach the live stream to the preview <video> after the recording UI
      // has rendered.
      requestAnimationFrame(() => {
        if (previewRef.current) {
          previewRef.current.srcObject = stream;
          previewRef.current.play().catch(() => {});
        }
      });

      const mimeCandidates = [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm",
        "video/mp4",
      ];
      const mime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m));
      const recorder = mime
        ? new MediaRecorder(stream, { mimeType: mime })
        : new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const wasCancelled = cancelledRef.current;
        const type = recorder.mimeType || "video/webm";
        const chunks = chunksRef.current;
        chunksRef.current = [];
        stopStream();
        recorderRef.current = null;
        if (wasCancelled || chunks.length === 0) {
          setStage("idle");
          return;
        }
        const blob = new Blob(chunks, { type });
        const ext = type.includes("mp4") ? "mp4" : "webm";
        const file = new File([blob], `bsl-feedback-${Date.now()}.${ext}`, {
          type,
        });
        handleFile(file);
      };
      recorder.start();

      const startedAt = Date.now();
      tickRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startedAt;
        setRecordingMs(elapsed);
        if (elapsed >= MAX_RECORD_MS) stopRecording();
      }, 250);
    } catch (err) {
      stopStream();
      setStage("error");
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        setErrorMsg(
          "Camera and microphone access was blocked. Allow access in your browser, or use Upload file instead."
        );
      } else if (
        err instanceof DOMException &&
        (err.name === "NotFoundError" || err.name === "OverconstrainedError")
      ) {
        setErrorMsg(
          "No camera was found. Please connect a camera or use Upload file instead."
        );
      } else {
        setErrorMsg("Couldn't open the camera. Please try Upload file instead.");
      }
    }
  }

  function stopRecording() {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    }
  }

  function cancelRecording() {
    cancelledRef.current = true;
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    } else {
      stopStream();
      setStage("idle");
    }
  }

  function reset() {
    setStage("idle");
    setProgress(0);
    setErrorMsg("");
  }

  if (stage === "recording") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-pi-accent/30 bg-white p-6 text-center shadow-sm">
        <div className="relative aspect-video w-full max-w-xl overflow-hidden rounded-xl bg-black">
          <video
            ref={previewRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />
          <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            REC {formatMs(recordingMs)}
          </span>
        </div>
        <p className="text-sm text-pi-ink/70">
          Sign your message, then click Stop &amp; upload.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={stopRecording}
            className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all hover:brightness-110"
          >
            Stop &amp; upload
          </button>
          <button
            onClick={cancelRecording}
            className="inline-flex items-center gap-2 rounded-full border border-pi-ink/15 bg-white px-6 py-3 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/10"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (stage === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-green-500/30 bg-green-50 p-8 text-center">
        <CheckCircle size={40} className="text-green-600" />
        <p className="font-display text-xl text-pi-ink">Thank you!</p>
        <p className="text-base text-pi-ink/70">
          Your video has been received. It means a lot and helps us improve access for everyone.
        </p>
        <button
          onClick={reset}
          className="mt-4 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
        >
          Send another
        </button>
      </div>
    );
  }

  if (stage === "uploading") {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-pi-accent/25 bg-pi-accent/5 p-8 text-center">
        <Loader2 size={32} className="animate-spin text-pi-accent" />
        <p className="text-base font-semibold text-pi-ink">Uploading your video...</p>
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-pi-ink/10">
          <div
            className="h-full rounded-full bg-pi-accent transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-pi-ink/70">Please keep this page open</p>
      </div>
    );
  }

  if (stage === "error") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-500/30 bg-red-50 p-8 text-center">
        <X size={32} className="text-red-600" />
        <p className="text-base font-semibold text-pi-ink">{errorMsg}</p>
        <button
          onClick={reset}
          className="mt-2 text-sm font-semibold text-pi-accent transition-colors hover:text-pi-ink"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-pi-ink/25 bg-white p-8 text-center shadow-sm transition-colors hover:border-pi-accent/40 hover:bg-pi-accent/5">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pi-accent/10">
        <Camera size={28} className="text-pi-accent" />
      </div>
      <p className="font-display text-xl text-pi-ink">
        Record a video in BSL or ISL
      </p>
      <p className="max-w-sm text-base text-pi-ink/70">
        Share your experience in sign language. Your feedback goes straight to PI and helps us improve access for everyone.
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <button
          onClick={handleRecordClick}
          className="inline-flex items-center gap-2 rounded-full bg-pi-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pi-accent/25 transition-all duration-200 hover:brightness-110"
        >
          <Camera size={16} />
          Record video
        </button>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-pi-ink/15 bg-pi-canvas-soft px-6 py-3 text-sm font-semibold text-pi-ink transition-all hover:border-pi-accent/40 hover:bg-pi-accent/10">
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
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        capture="user"
        className="hidden"
        onChange={handleChange}
      />
      <p className="text-xs text-pi-ink/50">Max 50MB. MP4, MOV, WebM supported.</p>
    </div>
  );
}
