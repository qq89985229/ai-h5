import {IPlan} from "./plan";

export interface IOrder{
  id: string;
  outTradeNo: string;
  plan: IPlan;
  tradeState: string;
  payCodeUrl: string;
}
