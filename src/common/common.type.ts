import { IUpdateResult } from './common.interfcae';

export type OrderType = 'ASC' | 'DESC';
export type OptionalNumberType = number | null | undefined;
export type PlainErrMsgType = string;
export type ListErrMsgType = string[];
export type ObjectErrMsgType = Record<'message', string | string[]>;
export type UpdateResultType = IUpdateResult;
export type AsyncUpdateResultType = Promise<IUpdateResult>;
