import { useCallback, useEffect, useState } from "react";
import { useProductStore } from "../redux/hooks/useProducStore";
import { ProductItem } from "../components/productItem";
import { useOrderStore } from "../redux/hooks/useOrderStore";
import type { Product } from "../models/Products";
import { CheckPaymentStatusModal } from "../modals/CheckPaymentStatusModal";
import type { SelectedProduct } from "../models/selectedProduct";
import { CreditCardDeliveryInfo } from "../modals/CreditCardDeliveryInfo";
import { ConfirmOrderModal } from "../modals/ConfirmOrder";
import type { NewOrderResponse } from "../interfaces/newOrder";

interface ModalStates {
  isCreditCardDeliveryInfo: boolean;
  confirmOrderProduct: boolean;
  paymentResponse: boolean;
}

export const StorePage = () => {
  const { findProductsAction, products } = useProductStore();
  const { productsSelected, addSelectedProductAction } = useOrderStore();
  const [newOrder, setNewOrder] =useState<NewOrderResponse>()
  const [modalState, setModalState] = useState<ModalStates>({
    isCreditCardDeliveryInfo: false,
    confirmOrderProduct: false,
    paymentResponse: false,
  });

  useEffect(() => {
    findProductsAction();
  }, []);

  useEffect(() => {}, [modalState]);

  const AddProductToOrderHandler = useCallback(
    (product: Product, quantity: number) => {
      const orderItem: SelectedProduct = {
        ...product,
        quantity: quantity,
      };
      addSelectedProductAction(orderItem);
      setModalState((prev) => ({ ...prev, isCreditCardDeliveryInfo: true }));
      return orderItem;
    },
    [productsSelected, addSelectedProductAction]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="pt-12 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4  overflow ">
        {products.map((product: Product, i: number) => (
          <ProductItem
            key={`${product.id}-${i}`}
            product={product}
            isInSale={i % 4 == 0}
            onAddProductToOrder={AddProductToOrderHandler}
          />
        ))}
        

        {modalState.isCreditCardDeliveryInfo && (
          <CreditCardDeliveryInfo
            onSummary={()=>{
              setModalState((prev) => ({
                ...prev,
                isCreditCardDeliveryInfo: false,
                confirmOrderProduct: true,
              }));
            }}
            onClose={() => {
              setModalState((prev) => ({ ...prev, isCreditCardDeliveryInfo: false }));
            }}
          />
        )}

        {modalState.confirmOrderProduct && (
          <ConfirmOrderModal
            onCancel={() =>
              setModalState((prev) => ({ ...prev, confirmOrderProduct: false }))
            }
            onCheckout={(order:NewOrderResponse) => {
              setNewOrder(order)
              setModalState((prev) => ({
                ...prev,
                confirmOrderProduct: false,
                paymentResponse: true,
              }));
            }}
          />
        )}

        {modalState.paymentResponse && newOrder && <CheckPaymentStatusModal transactionId={newOrder.transaction.id} onClose={()=>{
          setNewOrder(undefined)
          setModalState((prev) => ({
            ...prev,
            paymentResponse: false,
          }));
        }}/>}
      </div>
    </div>
  );
};
