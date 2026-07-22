import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.lsvem24.app&pcampaignid=web_share";

const AppRedirect = () => {
  const location = useLocation();

  useEffect(() => {
    const isAndroid = /android/i.test(navigator.userAgent);
    const rawPath = location.pathname.replace(/^\//, ""); // e.g. "videos/6a607d8dd833efa3c70edb2d"

    if (isAndroid) {
      const intentUrl = `intent://${rawPath}#Intent;scheme=https;package=com.lsvem24.app;S.browser_fallback_url=${encodeURIComponent(
        PLAY_STORE_URL
      )};end;`;
      window.location.href = intentUrl;
    } else {
      window.location.replace(PLAY_STORE_URL);
    }

    // Safety fallback: Redirect to Play Store after 800ms
    const timer = setTimeout(() => {
      window.location.replace(PLAY_STORE_URL);
    }, 800);

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div
      style={{
        backgroundColor: "#0f0f0f",
        color: "#ffffff",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          border: "4px solid rgba(255,255,255,0.1)",
          borderLeftColor: "#ff0000",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "20px",
        }}
      />
      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      <h2 style={{ margin: "0 0 10px 0", fontSize: "22px" }}>Opening LSVEM24...</h2>
      <p style={{ color: "#aaa", marginBottom: "24px", fontSize: "14px" }}>
        If you are not redirected automatically, tap the button below.
      </p>
      <a
        href={PLAY_STORE_URL}
        style={{
          backgroundColor: "#ff0000",
          color: "#ffffff",
          padding: "12px 28px",
          borderRadius: "25px",
          textDecoration: "none",
          fontWeight: "bold",
          fontSize: "15px",
          display: "inline-block",
        }}
      >
        Get LSVEM24 on Play Store
      </a>
    </div>
  );
};

export default AppRedirect;
