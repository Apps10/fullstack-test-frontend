import { useMemo, type ReactElement } from "react";

type Brand = "visa" | "mastercard" | "amex" | "discover" | "unknown";

interface Props {
  card: {
    cardName: string;
    cardNumber: string;
    expDate: string;
    cvv: string;
    isFlipped: boolean;
  };
}

export const CardBrandIcon = ({
  brand,
}: {
  brand: Brand;
}): ReactElement | null => {
  const brandIcon: Record<Brand, ReactElement> = {
    visa: (
      <img src="card-visa.svg" className="bg-white" width="48" height="30" />
    ),
    amex: <img src="card-amex.svg" width="48" height="30" />,
    mastercard: <img src="card-mastercard.svg" width="48" height="30" />,
    discover: <img src="card-discover.svg" width="48" height="30" />,
    unknown: <img src="card-unknow.svg" width="48" height="30" />,
  };

  return (
    <div className="flex items-center justify-center">
      {brandIcon[brand] ?? null}
    </div>
  );
};

const detectBrand = (num: string): Brand => {
  const digits = num.replace(/\D/g, "");
  if (/^4/.test(digits)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(?:011|5)/.test(digits)) return "discover";
  return "unknown";
};

const maskedNumberForDisplay = (raw: string) => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "•••• •••• •••• ••••";
  const last4 = digits.slice(-4);
  const masked = digits.slice(0, -4).replace(/\d/g, "•");
  const combined = masked + last4;
  if (/^3[47]/.test(digits)) {
    const p1 = combined.slice(0, 4);
    const p2 = combined.slice(4, 10);
    const p3 = combined.slice(10, 15);
    return [p1, p2, p3].filter(Boolean).join(" ");
  }
  return combined.match(/.{1,4}/g)?.join(" ") ?? combined;
};

export const CheckoutCardCard = ({ card }: Props) => {
  const { cardName, cardNumber, cvv, expDate, isFlipped } = card;
  const brand = useMemo(() => detectBrand(cardNumber), [cardNumber]);
  const masked = useMemo(
    () => maskedNumberForDisplay(cardNumber),
    [cardNumber]
  );

  const cardInnerStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    position: "relative",
    transformStyle: "preserve-3d",
    transition: "transform 700ms",
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    willChange: "transform",
  };

  const faceCommon: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    borderRadius: "1rem",
    overflow: "hidden",
  };

  const backFaceStyle: React.CSSProperties = {
    ...faceCommon,
    transform: "rotateY(180deg)",
  };

  return (
    <div className="w-full mt-6 flex flex-col items-center">
      <div className="w-full max-w-[360px]">
        <div style={{ perspective: 1200 }}>
          <div style={{ width: "100%", height: 260 }}>
            <div style={cardInnerStyle}>
              <div
                style={{
                  ...faceCommon,
                  padding: 20,
                  background:
                    "linear-gradient(135deg, rgba(20,20,30,0.95), rgba(60,60,75,0.95))",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
                aria-hidden={isFlipped}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-white/10 flex items-center justify-center">
                      <div className="w-6 h-4 bg-yellow-300 rounded-sm" />
                    </div>
                    <span className="text-xs text-white/80">Banco Demo</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CardBrandIcon brand={brand} />
                  </div>
                </div>

                <div>
                  <div className="text-xs tracking-widest font-mono text-white/60 uppercase">
                    Número
                  </div>
                  <div className="mt-1 text-xl sm:text-2xl font-semibold font-mono">
                    {cardNumber ? (
                      masked
                    ) : (
                      <span className="text-white/40">•••• •••• •••• ••••</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end mt-2 text-sm">
                  <div>
                    <div className="text-xs text-white/60">Nombre</div>
                    <div className="font-medium truncate">
                      {cardName || "NOMBRE APELLIDO"}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-white/60">Exp</div>
                    <div className="font-medium">{expDate || "MM/YY"}</div>
                  </div>
                </div>
              </div>

              <div style={backFaceStyle}>
                <div
                  style={{
                    padding: 20,
                    background:
                      "linear-gradient(135deg, rgba(40,40,45,0.98), rgba(20,20,30,0.98))",
                    color: "white",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    gap: 12,
                  }}
                  aria-hidden={!isFlipped}
                >
                  <div
                    style={{
                      height: 56,
                      background: "#000",
                      borderRadius: 4,
                    }}
                  />

                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          background: "white",
                          color: "#111",
                          padding: "8px 10px",
                          borderRadius: 6,
                        }}
                      >
                        <div style={{ fontSize: 11, color: "#666" }}>Firma</div>
                        <div
                          style={{ fontFamily: "monospace", fontWeight: 600 }}
                        >
                          {cardName ? cardName.slice(0, 22) : "Firma"}
                        </div>
                      </div>
                    </div>

                    <div style={{ width: 96 }}>
                      <div
                        style={{
                          fontSize: 12,
                          color: "rgba(255,255,255,0.8)",
                        }}
                      >
                        CVV
                      </div>
                      <div
                        style={{
                          marginTop: 6,
                          background: "white",
                          color: "#000",
                          padding: "10px 8px",
                          borderRadius: 6,
                          fontFamily: "monospace",
                          fontWeight: 700,
                          textAlign: "right",
                          letterSpacing: "4px",
                        }}
                      >
                        {cvv ? cvv.padEnd(3, "•") : "•••"}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      fontSize: 12,
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    Información adicional
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
