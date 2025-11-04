import { useMemo } from 'react';
import { MinusIcon, Plus, X } from 'lucide-react';
import type { SelectedProduct } from '../models/selectedProduct';

interface Props {
  selectedProduct: SelectedProduct;
  onMinus: (productSelected: SelectedProduct) => void;
  onSum: (productSelected: SelectedProduct) => void;
  onRemove?: (productSelected: SelectedProduct) => void;
}

export const ConfirmOrderItem = ({ selectedProduct, onMinus, onSum, onRemove }: Props) => {
  const { name, quantity, description, picture, price } = selectedProduct;

  const formatter = useMemo(() => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), []);

  return (
    <article className="w-full bg-white rounded-lg shadow-sm p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <div className="flex items-start gap-3 w-full">
        <img src={picture} alt={name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md shrink-0 bg-gray-100" />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="pr-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">{name}</h3>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">{description}</p>
            </div>

            <button
              onClick={() => onRemove?.(selectedProduct)}
              aria-label={`Eliminar ${name}`}
              className="ml-auto p-1 rounded-full text-gray-400 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 p-1">
              <button
                onClick={() => onMinus(selectedProduct)}
                aria-label={`Disminuir cantidad de ${name}`}
                className="p-2 rounded-md hover:bg-gray-200 active:scale-95 transition"
              >
                <MinusIcon className="w-4 h-4" />
              </button>

              <div className="w-12 text-center font-medium text-sm">{quantity}</div>

              <button
                onClick={() => onSum(selectedProduct)}
                aria-label={`Aumentar cantidad de ${name}`}
                className="p-2 rounded-md hover:bg-gray-200 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="ml-auto text-right">
              <div className="text-xs text-gray-500">Precio</div>
              <div className="font-semibold text-gray-900">{formatter.format(price)}</div>
              <div className="text-xs text-gray-400">{formatter.format(price * quantity)} total</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};
