import { useMemo, useState } from 'react';
import { useOrderStore } from '../redux/hooks/useOrderStore';
import { ConfirmOrderItem } from '../components/confirmOrderItem';
import { X } from 'lucide-react';
import type { SelectedProduct } from '../models/selectedProduct';
import { v4 as uuidv4 } from 'uuid'
import { newOrder } from "../redux/slice/orderSlice";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../redux/store/store';
import { usePaymentStore } from '../redux/hooks/usePaymentStore';
import type { NewOrderResponse } from '../interfaces/newOrder';

interface Props {
  onCancel: () => void;
  onCheckout: (order:NewOrderResponse) => void;
}

export const ConfirmOrderModal = ({ onCancel, onCheckout }: Props) => {
  const orderId = uuidv4();
  const dispatch = useDispatch<AppDispatch>();
  const {payOrderAction } = usePaymentStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const {
    productsSelected,
    // addSelectedProductAction,
    decreaseSelectedQuantityProductAction,
    increaseSelectedQuantityProductAction,
    removeSelectedProductAction
  } = useOrderStore();

  const formatter = useMemo(() => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }), []);

  const subtotal = useMemo(() => {
    return productsSelected.reduce((acc:number, producto: SelectedProduct) => acc + producto.quantity * producto.price, 0);
  }, [productsSelected]);

  

  const iva = Math.round(subtotal * 0.19 * 100) / 100;
  const total = Math.round((subtotal + iva) * 100) / 100;

  const handlePay = async () => {
    console.log({ items: productsSelected, subtotal, iva, total })
    setIsCheckingOut(true)
     try{
      const order = await dispatch(newOrder(orderId)).unwrap();
      await payOrderAction(order)
      await Promise.resolve(onCheckout(order))
    }catch(error){
      console.error(error)
    }
    setIsCheckingOut(false)
  };

  if (!productsSelected) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full sm:max-w-2xl max-h-[80vh] min-h-[70vh] bg-white rounded-t-2xl sm:rounded-2xl shadow-lg overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-3">
            <button onClick={onCancel} className="sm:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold">Tu carrito</h2>
            <span className="text-sm text-gray-500">{productsSelected.length} items</span>
          </div>
          <button onClick={onCancel} className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 hover:bg-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-4 py-3 overflow-y-auto space-y-3">
          {productsSelected.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No hay productos en el carrito.</p>
          ) : (
            productsSelected.map((productSelected: SelectedProduct) => (
              <ConfirmOrderItem
                key={productSelected.id}
                selectedProduct={productSelected}
                onMinus={decreaseSelectedQuantityProductAction}
                onSum={increaseSelectedQuantityProductAction}
                onRemove={removeSelectedProductAction}
              />
            ))
          )}
        </div>

        <div className="mt-auto border-t px-4 py-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-semibold">{formatter.format(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Iva 9%</span>
            <span className="text-sm text-gray-600">{formatter.format(iva)}</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-base font-bold">Total</span>
            <span className="text-base font-bold">{formatter.format(total)}</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={handlePay}
              disabled={productsSelected.length === 0 || isCheckingOut }
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition disabled:opacity-60  cursor-pointer"
            >
              <span>{!isCheckingOut ?"Checkout": "Por favor espere..."  }</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
