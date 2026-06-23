"use client";

import { useState } from "react";

export default function EntryGate({
  onReady,
}: {
  onReady: (lat: number, lng: number) => void;
}) {
  const [status, setStatus] = useState<"idle" | "locating" | "error">("idle");
  const [error, setError] = useState<string>("");

  function enter() {
    if (!("geolocation" in navigator)) {
      setStatus("error");
      setError("Your browser doesn't support location access.");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => onReady(pos.coords.latitude, pos.coords.longitude),
      (err) => {
        setStatus("error");
        setError(
          err.code === err.PERMISSION_DENIED
            ? "Location permission is required to place you on the map."
            : "Couldn't get your location. Please try again.",
        );
      },
      { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center gap-10 bg-zinc-950 p-6 text-zinc-100">
      <div className="text-center">
        <div className="mb-4 inline-block rounded-full bg-emerald-400/10 px-4 py-1 text-xs font-medium uppercase tracking-widest text-emerald-400">
          Live
        </div>
        <h1 className="text-5xl font-bold tracking-tight">Pulse</h1>
        <p className="mt-3 max-w-sm text-zinc-400 leading-relaxed">
          A living globe of anonymous strangers. Drop onto the map and connect with someone, anywhere.
        </p>
      </div>

      <button
        onClick={enter}
        disabled={status === "locating"}
        className="rounded-full bg-emerald-400 px-10 py-3.5 font-semibold text-zinc-950 transition hover:bg-emerald-300 disabled:opacity-60 text-base"
      >
        {status === "locating" ? "Locating..." : "Enter Pulse"}
      </button>

      {status === "error" && (
        <p className="max-w-sm text-center text-sm text-red-400">{error}</p>
      )}

      <p className="max-w-sm text-center text-xs text-zinc-600">
        No sign-up. Your dot is placed 1-3 km from your real location. Nothing is stored — closing the tab ends everything.
      </p>
    </div>
  );
}