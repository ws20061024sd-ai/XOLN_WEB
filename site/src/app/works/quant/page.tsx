"use client";

export default function QuantPage() {
  return (
    <div style={{ width: "100%", height: "calc(100vh - 80px)", border: "none" }}>
      <iframe
        src="/works/quant/index.html"
        style={{ width: "100%", height: "100%", border: "none" }}
        title="量化交易仪表盘"
      />
    </div>
  );
}
