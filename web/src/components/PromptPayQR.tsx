"use client";

import { useEffect, useState } from "react";
import generatePayload from "promptpay-qr";
import QRCode from "qrcode";

const PROMPTPAY_PHONE = "0950579660";

export default function PromptPayQR({ amount }: { amount: number }) {
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  useEffect(() => {
    const payload = generatePayload(PROMPTPAY_PHONE, { amount });
    QRCode.toDataURL(payload, {
      width: 280,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    }).then(setQrUrl);
  }, [amount]);

  if (!qrUrl) return null;

  return (
    <div className="inline-block bg-white p-4 rounded-xl mb-3">
      <img src={qrUrl} alt="PromptPay QR Code" width={280} height={280} />
    </div>
  );
}
