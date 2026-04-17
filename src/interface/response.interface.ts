import { HttpStatus } from '@nestjs/common';

export interface IMeta {
  length: number;
  prev: number | null;
  next: number | null;
}

interface ISuccessResponse<T> {
  status: HttpStatus;
  message: string;
  data: T;
}

interface ISuccessResponseMultiple<T> {
  status: HttpStatus;
  message: string;
  data: T[];
  meta: IMeta;
}

export class SuccessResponse<T> implements ISuccessResponse<T> {
  status: HttpStatus = HttpStatus.OK;
  message: string = 'success';
  data: any = null;

  constructor({
    data,
    message,
    status,
  }: Partial<ISuccessResponse<T>> & {
    data: T;
  }) {
    this.data = data && Object.keys(data).length === 0 ? null : data;
    if (message) this.message = message;
    if (status) this.status = status;
  }
}

export class SuccessResponseMultiple<T> implements ISuccessResponseMultiple<T> {
  status = HttpStatus.OK;
  message = 'success';
  meta: IMeta = {
    length: 100,
    next: 5,
    prev: 3,
  };
  data: T[] = [];

  constructor({
    data,
    message,
    meta,
    status,
  }: Partial<ISuccessResponseMultiple<T>> & {
    data: T[];
  }) {
    if (data) this.data = data;
    if (message) this.message = message;
    if (meta) this.meta = meta;
    if (status) this.status = status;
  }
}
