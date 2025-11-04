import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Copy, Download } from "lucide-react";
import type { Transaction } from "../interfaces/transaction";
import { findById } from "../redux/slice/paymentSlice";
import { useAppDispatch } from "../redux/store/hook";
import { useProductStore } from "../redux/hooks/useProducStore";
import { useOrderStore } from "../redux/hooks/useOrderStore";

export type PaymentResponse = {
  status: Transaction["paymentStatus"];
  totalAmount: number | string;
  created_at: string | Date;
  orderId: string;
  method?: string;
  payerName?: string;
  details?: string;
};

interface Props {
  transactionId: string;
  onClose?: () => void;
  onViewOrder?: (orderId: string) => void;
  className?: string;
}

const statusMeta = (status: Transaction["paymentStatus"]) => {
  const s = String(status).toLowerCase();
  if (s.includes("success") || s === "completed" || s === "paid") {
    return {
      label: "Completada",
      color: "bg-emerald-100 text-emerald-800",
      icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
    };
  }
  if (s.includes("pend") || s === "pending") {
    return {
      label: "Pendiente",
      color: "bg-yellow-100 text-yellow-800",
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
    };
  }
  return {
    label: "Fallida",
    color: "bg-rose-100 text-rose-800",
    icon: <XCircle className="w-5 h-5 text-rose-600" />,
  };
};

const formatCurrency = (value: number | string) => {
  if (typeof value === "number") {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(value);
  }
  return String(value);
};

const formatDate = (d: string | Date) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const CheckPaymentStatusModal: React.FC<Props> = ({
  transactionId,
  onClose,
  className,
}) => {
  const dispatch = useAppDispatch();
  const [transaction, setTransaction] = useState<Transaction>();
  const { updateStockProductSoldAction } = useProductStore()
  const { clearSelectedProductAction, productsSelected } = useOrderStore()

  const fetchTransaction = async () => {
    try {
      const res = await dispatch(findById(transactionId)).unwrap();
      setTransaction(res.Transaction);
    } catch (e) {
      console.error("Error fetching transaction:", e);
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, []);

  useEffect(()=>{
    if(transaction?.paymentStatus === "SUCCESS"){
      updateStockProductSoldAction(productsSelected)
      clearSelectedProductAction()
    }
  },[transaction])

  if (!transaction) return null;

  const { label, color, icon } = statusMeta(transaction.paymentStatus);
  const reference = transaction.orderId;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(reference));
      alert("Referencia copiada");
    } catch {
      alert("No se pudo copiar la referencia");
    }
  };

  const handleDownloadReceipt = () => {
    const text = [
      "RECIBO DE PAGO",
      "====================",
      `Referencia: ${reference}`,
      `Estado: ${label}`,
      `Monto: ${formatCurrency(transaction.totalAmount)}`,
      `Método: Credit Card`,
      `Pagador: ${transaction.payerName ?? "—"}`,
      `Descripcion: ${transaction.description ?? "—"}`,
      `Fecha: ${formatDate(transaction.createdAt)}`,
    ].join("\n");

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `recibo_${reference}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 ${
        className ?? ""
      }`}
    >
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden ring-1 ring-gray-100">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-lg ${color}`}
            >
              {icon}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900">
                Estado de la transacción
              </h3>
              <p className="text-sm text-gray-500 mt-1 truncate">
                {label} — {formatDate(transaction.createdAt)}
              </p>
            </div>

            <button
              onClick={() => onClose?.()}
              aria-label="Cerrar"
              className="ml-2 p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Monto</p>
                <p className="text-sm font-medium text-gray-900">
                  {formatCurrency(transaction.totalAmount)}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500">Método</p>
                <p className="text-sm font-medium text-gray-900">
                  {"Credit Card"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Referencia</p>
                <p className="text-sm font-medium text-gray-900 break-all">
                  {reference}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                >
                  <Copy className="w-4 h-4" /> Copiar
                </button>

                <button
                  onClick={handleDownloadReceipt}
                  className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-sm text-gray-700"
                >
                  <Download className="w-4 h-4" /> Recibo
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500">Orden</p>
              <p className="text-sm font-medium text-indigo-700">
                {transaction.orderId}
              </p>
            </div>

             <div>
              <p className="text-xs text-gray-500">Description</p>
              <p className="text-sm font-medium text-black">
                {transaction.description}
              </p>
            </div>


            {transaction.payerName && (
              <div>
                <p className="text-xs text-gray-500">Pagador</p>
                <p className="text-sm font-medium text-gray-900">
                  {transaction.payerName}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3 justify-end">
            <button
              onClick={() => onClose?.()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
