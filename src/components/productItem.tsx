import { useCallback, useMemo, useState } from "react";
import { CreditCard, MinusIcon, Plus, Star } from "lucide-react";
import type { Product } from "../models/Products";

interface Props {
  product: Product;
  isInSale?: boolean;
  onAddProductToOrder?: (product: Product, quantity: number) => void;
}

export function ProductItem({
  product,
  isInSale = false,
  onAddProductToOrder,
}: Props) {
  const [quantity, setQuantity] = useState<number>(1);

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0,
      }),
    []
  );
  const originalPrice = useMemo(() => product.price, [product.price]);
  const salePrice = useMemo(
    () => Math.round(originalPrice * 1.2),
    [originalPrice]
  );
  const displayedPrice = isInSale ? salePrice : originalPrice;

  const decrease = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const increase = useCallback(() => {
    setQuantity((q) => {
      if (typeof product.stock === "number")
        return Math.min(product.stock, q + 1);
      return q + 1;
    });
  }, [product.stock]);

  const handlePay = useCallback(() => {
    onAddProductToOrder?.(product, quantity);
  }, [onAddProductToOrder, product, quantity]);

  const total = displayedPrice * quantity;

  return (
    <article className="max-w-sm w-full bg-white rounded-2xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl border border-gray-100">
      <div className="relative h-56 sm:h-64 lg:h-56 overflow-hidden bg-gray-50">
        <img
          src={product.picture}
          alt={product.name}
          className="w-full scale-90 h-full object-cover transform transition-transform duration-500 hover:scale-105"
        />

        {isInSale && (
          <span className="absolute top-4 left-4 bg-linear-to-r from-pink-500 to-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
            ¡Oferta!
          </span>
        )}

        {product.stock === 0 && (
          <span className="absolute top-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium">
            Agotado
          </span>
        )}
      </div>

      <div className="p-5 space-y-4">
        <header>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2 max-h-5">
            {product.description}
          </p>
        </header>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex flex-col items-baseline min-h-9">
              <span
                className={`${
                  isInSale
                    ? "text-sm text-gray-400 line-through visible"
                    : "invisible text-sm"
                }`}
              >
                {formatter.format(displayedPrice)}
              </span>

              <span className="text-2xl font-extrabold text-gray-900">
                {formatter.format(originalPrice)}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Stock:{" "}
              <span
                className={`font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-500"
                }`}
              >
                {product.stock}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-1" aria-hidden>
            <Star className="w-4 h-4 text-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400" />
            <Star className="w-4 h-4 text-gray-300" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center rounded-lg bg-gray-100 p-1">
            <button
              aria-label="disminuir cantidad"
              onClick={decrease}
              className="p-2 hover:bg-gray-200 rounded-md disabled:opacity-50"
            >
              <MinusIcon className="w-4 h-4" />
            </button>

            <div className="w-16 text-center font-medium">{quantity}</div>

            <button
              aria-label="aumentar cantidad"
              onClick={increase}
              className="p-2 hover:bg-gray-200 rounded-md disabled:opacity-50"
              disabled={
                typeof product.stock === "number"
                  ? quantity >= product.stock
                  : false
              }
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Total</p>
            <p className="font-semibold">{formatter.format(total)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={handlePay}
            disabled={product.stock === 0}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-60 hover:cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-sm">Pagar</span>
          </button>
        </div>
      </div>
    </article>
  );
}
