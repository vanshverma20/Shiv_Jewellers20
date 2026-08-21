"use client";
import { useState, useEffect, useRef } from "react";
import { Scan, QrCode, Search, AlertCircle, Camera, CameraOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QRScannerPage() {
  const [error, setError] = useState("");
  const [manualId, setManualId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [cameraAvailable, setCameraAvailable] = useState(true);
  const [scanSuccess, setScanSuccess] = useState(false);
  const scannerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Normalize and navigate to product scan page
  const navigateToProduct = (rawId: string) => {
    let id = rawId.trim().toUpperCase();
    // Extract JWL-XXXXXXX from a full URL if scanned from QR
    const match = id.match(/JWL-[A-Z0-9]{7}/);
    if (match) id = match[0];
    else if (!id.startsWith("JWL-")) id = `JWL-${id}`;
    setScanSuccess(true);
    setTimeout(() => router.push(`/scan/${id}`), 400);
  };

  const startCamera = async () => {
    if (typeof window === "undefined") return;
    setError("");
    setScanning(true);

    try {
      // Dynamically import html5-qrcode to avoid SSR issues
      const { Html5Qrcode } = await import("html5-qrcode");
      const containerId = "qr-reader-container";

      if (scannerRef.current) {
        try { await scannerRef.current.stop(); } catch {}
      }

      const scanner = new Html5Qrcode(containerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 300, height: 180 } },
        (decodedText) => {
          navigateToProduct(decodedText);
          scanner.stop().catch(() => {});
        },
        () => {} // ignore frequent not-found errors
      );
    } catch (err: any) {
      setScanning(false);
      if (err?.message?.includes("Permission") || err?.message?.includes("NotAllowed")) {
        setCameraAvailable(false);
        setError("Camera permission denied. Please use manual entry below.");
      } else {
        setCameraAvailable(false);
        setError("Camera unavailable. Please enter the product ID manually.");
      }
    }
  };

  const stopCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => () => { stopCamera(); }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualId.trim()) return;
    navigateToProduct(manualId);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(245,158,11,0.08),transparent)] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 pt-10 pb-6 text-center px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 mb-5 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <Scan className="text-amber-400" size={28} strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1.5">Verify Jewelry</h1>
        <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
          Scan the QR tag on your piece to confirm authenticity instantly.
        </p>
      </div>

      {/* Scanner area */}
      <div className="relative z-10 flex-1 px-6 pb-8 flex flex-col items-center gap-6 max-w-sm mx-auto w-full">

        {/* Camera viewport */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
          {/* html5-qrcode mounts its video here */}
          <div id="qr-reader-container" className="w-full h-full" ref={containerRef} />

          {/* Overlay when not scanning */}
          {!scanning && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900/90">
              {cameraAvailable ? (
                <>
                  <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Camera size={32} className="text-amber-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-slate-400 text-sm text-center px-6">Tap &#34;Start Camera&#34; to scan</p>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <CameraOff size={32} className="text-red-400" strokeWidth={1.5} />
                  </div>
                  <p className="text-slate-500 text-sm text-center px-6">Camera unavailable</p>
                </>
              )}
            </div>
          )}

          {/* Scanning overlay with corner brackets + animated line */}
          {scanning && !scanSuccess && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-20">
              {/* dark vignette */}
              <div className="absolute inset-0 bg-black/40" />
              {/* Cutout / bracket overlay */}
              <div className="relative w-72 h-44">
                {/* Corner brackets */}
                {[
                  "top-0 left-0 border-t-2 border-l-2 rounded-tl-md",
                  "top-0 right-0 border-t-2 border-r-2 rounded-tr-md",
                  "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-md",
                  "bottom-0 right-0 border-b-2 border-r-2 rounded-br-md",
                ].map((cls, i) => (
                  <div key={i} className={`absolute w-7 h-7 border-amber-400 ${cls}`} />
                ))}
                {/* Scanning line */}
                <div className="absolute inset-x-0 animate-[scanLine_2s_ease-in-out_infinite]">
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                </div>
              </div>
            </div>
          )}

          {/* Success flash */}
          {scanSuccess && (
            <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center z-30 animate-pulse">
              <div className="text-emerald-400 text-5xl">✓</div>
            </div>
          )}
        </div>

        {/* Camera control button */}
        {cameraAvailable && (
          <button
            onClick={scanning ? stopCamera : startCamera}
            className={`w-full py-3.5 rounded-xl font-semibold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg ${
              scanning
                ? "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                : "bg-amber-500 hover:bg-amber-400 text-white shadow-amber-900/30"
            }`}
          >
            {scanning ? (
              <><CameraOff size={18} /> Stop Camera</>
            ) : (
              <><Camera size={18} /> Start Camera</>
            )}
          </button>
        )}

        {error && (
          <div className="w-full bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl flex items-start gap-2 text-sm">
            <AlertCircle size={17} className="shrink-0 mt-0.5" />
            <p>{error}</p>
          </div>
        )}

        {/* Divider */}
        <div className="w-full flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-800" />
          <span className="text-slate-600 text-xs uppercase tracking-widest">or enter manually</span>
          <div className="flex-1 h-px bg-slate-800" />
        </div>

        {/* Manual entry */}
        <div className="w-full bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <p className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1.5 uppercase tracking-wider">
            <QrCode size={14} className="text-amber-500" /> Product ID
          </p>
          <form onSubmit={handleManualSubmit} className="flex gap-2">
            <input
              type="text"
              value={manualId}
              onChange={(e) => setManualId(e.target.value)}
              placeholder="JWL-XXXXXXX"
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-100 placeholder:text-slate-700 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 font-mono tracking-widest uppercase text-sm shadow-inner"
            />
            <button
              type="submit"
              className="bg-amber-600 hover:bg-amber-500 text-white px-5 rounded-lg flex items-center justify-center transition-colors shadow-lg shadow-amber-950/40"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        <p className="text-slate-700 text-xs text-center pb-4">
          The ID is printed on the physical tag · Format: JWL-XXXXXXX
        </p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scanLine {
          0%   { top: 2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: calc(100% - 2px); opacity: 0; }
        }
        #qr-reader-container video { width: 100% !important; height: 100% !important; object-fit: cover; }
        #qr-reader-container > div { display: none !important; }
      `}} />
    </div>
  );
}
