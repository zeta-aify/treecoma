"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export function InstagramEmbed({ url }: { url: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Instagram embed script if not already loaded
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [url]);

  return (
    <div ref={ref} className="instagram-embed-container">
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink={url}
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "12px",
          margin: "0 auto",
          maxWidth: "540px",
          width: "100%",
          padding: 0,
        }}
      />
    </div>
  );
}

export function InstagramFeedEmbed({ username }: { username: string }) {
  return (
    <div className="instagram-embed-container">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/${username}/`}
        style={{
          background: "#FFF",
          border: 0,
          borderRadius: "12px",
          margin: "0 auto",
          maxWidth: "540px",
          width: "100%",
          padding: 0,
        }}
      />
    </div>
  );
}
