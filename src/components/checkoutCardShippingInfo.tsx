import type { ShippingInfo } from "../models/ShippingInfo";


export const CheckoutCardShippingInfo = ({
  address,
  city,
  contry,
  postalCode,
  shippName,
  state,
  email,
  phone
}: ShippingInfo) => {
  return (
    <div className="w-full max-w-[360px] bg-white/10 rounded-lg p-4">
      <h4 className="text-md font-semibold">Envío</h4>
      <p className="text-sm text-white/80 mt-2">
        {shippName || "Nombre destinatario"}
      </p>
      <p className="text-sm text-white/80">{address || "Dirección"}</p>
      <p className="text-sm text-white/80">
        {city ? `${city} · ${state}` : "Ciudad · Estado"}
      </p>
      <p className="text-sm text-white/80">
        {postalCode ? `${postalCode} · ${contry}` : "Código · País"}
      </p>
      <p className="text-sm text-white/80">
        {email ? `${email} · ${phone}` : "Correo · Telefono"}
      </p>
    </div>
  );
};
