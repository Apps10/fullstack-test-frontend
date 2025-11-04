import { useAppDispatch, useAppSelector } from "../store/hook";
import { addShippingInfo } from "../slice/shippingSlice";
import type { ShippingInfo } from "../../models/ShippingInfo";

export const useShippingStore = () => {
  const dispatch = useAppDispatch();

  const shippingInfo = useAppSelector((state) => state.shipping.shippingInfo);
  const addShippingInfoAction = (data: ShippingInfo) =>
    dispatch(addShippingInfo(data));
  return {
    shippingInfo,
    addShippingInfoAction,
  };
};
