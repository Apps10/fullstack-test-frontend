import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { CheckoutCardCard } from "../components/checkoutCardCard";
import { CheckoutCardShippingInfo } from "../components/checkoutCardShippingInfo";
import type { ShippingInfo } from "../models/ShippingInfo";
import type { PaymentMethodCard } from "../interfaces/paymentMethodCard";
import { usePaymentStore } from "../redux/hooks/usePaymentStore";
import { useShippingStore } from "../redux/hooks/useShippingStore";

type Props = {
  onClose: () => void;
  onSummary: () => void
};

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  if (/^3[47]/.test(digits)) {
    const part1 = digits.slice(0, 4);
    const part2 = digits.slice(4, 10);
    const part3 = digits.slice(10, 15);
    return [part1, part2, part3].filter(Boolean).join(" ");
  }
  return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
};

export const CreditCardDeliveryInfo = ({ onClose, onSummary }: Props) => {
  const { addCreditCardAction } = usePaymentStore();
  const { addShippingInfoAction } = useShippingStore();
  const [isFlipped, setIsFlipped] = useState(false);


  const [card, setCard] = useState<PaymentMethodCard>({
    cardName: "",
    cardNumber: "",
    cvv: "",
    expDate: "",
  });

  const [shipping, setShipping] = useState<ShippingInfo>({
    email: '',
    phone: "",
    shippName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    contry: "",
  });

  const formattedNumber = useMemo(
    () => formatCardNumber(card.cardNumber),
    [card.cardNumber]
  );

  const handleNumberChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 19);
    setCard((prev) => ({ ...prev, cardNumber: digits }));
  };

  const handleExpChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) setCard((prev) => ({ ...prev, expDate: digits }));
    else
      setCard((prev) => ({
        ...prev,
        expDate: digits.slice(0, 2) + "/" + digits.slice(2),
      }));
  };

  const handleCvvChange = (v: string) => {
    const digits = v.replace(/\D/g, "");
    setCard((prev) => ({ ...prev, cvv: digits.slice(0, 4) }));
  };

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (
      !card.cardName ||
      card.cardNumber.replace(/\D/g, "").length < 12 ||
      card.expDate.length < 4 ||
      card.cvv.length < 3
    ) {
      alert("Completa los datos de la tarjeta correctamente");
      return;
    }
    if (
      !shipping.shippName ||
      !shipping.address ||
      !shipping.city ||
      !shipping.contry ||
      !shipping.phone ||
      !shipping.email
    ) {
      alert("Completa la información de envío");
      return;
    }

    addCreditCardAction(card);
    addShippingInfoAction(shipping);
    onSummary()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-auto">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 bg-linear-to-br from-indigo-600 via-indigo-500 to-purple-600 text-white">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold">Resumen</h3>
              <button
                onClick={onClose}
                className="p-2 rounded-md bg-white/20 hover:bg-white/30"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 flex flex-col items-center gap-6">
              <CheckoutCardShippingInfo {...shipping} />
              <div className="mt-5"></div>
              <CheckoutCardCard card={{ ...card, isFlipped }} />
            </div>
          </div>

          <form onSubmit={submit} className="w-full md:w-1/2 p-6">
            <h4 className="text-sm md:text-base font-semibold mb-4 text-gray-800">
              Información de Envío
            </h4>

            <div className="space-y-3">
              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  Nombre del destinatario
                </label>
                <input
                  value={shipping.shippName}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, shippName: e.target.value }))
                  }
                  placeholder="Nombre quien recibe"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  Correo del destinatario
                </label>
                <input
                  value={shipping.email}
                  type="email"
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, email: e.target.value }))
                  }
                  placeholder="Correo quien recibe"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>


              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">
                  Telefono del destinatario
                </label>
                <input
                  value={shipping.phone}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, phone: e.target.value }))
                  }
                  placeholder="Telefono quien recibe"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-sm text-gray-600 mb-1">Dirección</label>
                <input
                  value={shipping.address}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, address: e.target.value }))
                  }
                  placeholder="Calle, número, apto"
                  className="w-full p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-3">
                <input
                  value={shipping.city}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, city: e.target.value }))
                  }
                  placeholder="Ciudad"
                  className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all mb-3 sm:mb-0"
                />
                <input
                  value={shipping.state}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, state: e.target.value }))
                  }
                  placeholder="Estado / Depto"
                  className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:gap-3">
                <input
                  value={shipping.postalCode}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, postalCode: e.target.value }))
                  }
                  placeholder="Código postal"
                  className="flex-1 p-3 rounded-lg border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all mb-3 sm:mb-0"
                />
                <select
                  value={shipping.contry}
                  onChange={(e) =>
                    setShipping((s) => ({ ...s, contry: e.target.value }))
                  }
                  className="flex-1 p-3 rounded-lg border border-gray-200 bg-white text-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition-all"
                >
                  <option value="">Selecciona país</option>
                  <option value="COL">Colombia</option>
                  <option value="US">Estados Unidos</option>
                  <option value="MX">México</option>
                  <option value="ES">España</option>
                </select>
              </div>
            </div>

            <div className="mt-6 pt-2 border-t">
              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium">
                  Nombre del propietario
                </label>
                <input
                  value={card.cardName}
                  onChange={(e) =>
                    setCard((prev) => ({
                      ...prev,
                      cardName: e.target.value.toUpperCase(),
                    }))
                  }
                  placeholder="Pepito Perez"
                  className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-200"
                />

                <label className="text-sm font-medium">Número de tarjeta</label>
                <input
                  inputMode="numeric"
                  value={formattedNumber}
                  onChange={(e) => handleNumberChange(e.target.value)}
                  placeholder="XXXX XXXX XXXX XXXX"
                  className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-200 font-mono"
                />

                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Exp. date</label>
                    <input
                      inputMode="numeric"
                      value={card.expDate}
                      onChange={(e) => handleExpChange(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-200 font-mono"
                    />
                  </div>

                  <div className="w-32">
                    <label className="text-sm font-medium">CVV</label>
                    <input
                      inputMode="numeric"
                      value={card.cvv}
                      onFocus={() => setIsFlipped(true)}
                      onBlur={() => setIsFlipped(false)}
                      onChange={(e) => handleCvvChange(e.target.value)}
                      placeholder="123"
                      className="w-full p-3 rounded-md border border-gray-200 focus:ring-2 focus:ring-indigo-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md border border-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 disabled:bg-indigo-300 text-white"
                >
                  Ver Resumen
                </button>
              </div>

              <div className="text-xs text-gray-500 mt-2">
                Tu información se mantiene segura y se encripta localmente.
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
