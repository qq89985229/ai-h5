import {IPlan} from "./plan";

export interface IUserPlan{
  id: string;
  plan: IPlan;
  createdAt: string;
  expireAt: string;
}
