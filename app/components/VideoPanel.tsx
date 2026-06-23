"use client";

import { useEffect, useRef } from "react";

export default function VideoPanel({
  localStream,
  remoteStream,
  onEnd,
}: {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  onEnd: () => void;
}) {
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localRef.current && localRef.current.srcObject !== localStream) {
      localRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteRef.current && remoteRef.current.srcObject !== remoteStream) {
      remoteRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  return (
    <div className="absolute inset-0 z-30 flex flex-col bg-zinc-950">
      <div className="relative flex-1">
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="h-full w-full object-cover"
        />
        {!remoteStream && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-600">
            Waiting for stranger's video...
          </div>
        )}
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 h-36 w-24 rounded-xl border border-zinc-700 bg-zinc-900 object-cover shadow-xl"
        />
      </div>
      <div className="flex justify-center bg-zinc-950 border-t border-zinc-800/60 p-4">
        <button
          onClick={onEnd}
          className="rounded-full bg-red-500 px-10 py-3 text-sm font-semibold text-white hover:bg-red-400 transition"
        >
          End video
        </button>
      </div>
    </div>
  );
}