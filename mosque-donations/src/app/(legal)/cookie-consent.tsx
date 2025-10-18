"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
  }, []);
  if (!visible) return null;
  return (
    <div className="fixed bottom-4 inset-x-0 px-4">
      <div className="mx-auto max-w-3xl rounded bg-neutral-900 text-white p-4 flex items-center justify-between gap-3">
        <p className="text-sm">Kami menggunakan cookie untuk meningkatkan pengalaman Anda. Dengan melanjutkan, Anda menyetujui kebijakan cookie kami.</p>
        <button className="bg-white text-black rounded px-3 py-1" onClick={() => { localStorage.setItem("cookie-consent", "1"); setVisible(false); }}>Setuju</button>
      </div>
    </div>
  );
}
