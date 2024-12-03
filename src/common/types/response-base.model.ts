export interface IresponseBase<T = any> {
  code: string;
  message: string;
  status: number;
  data?: T;
  // pagination?: Ipaginator;
}

export class ResponseBase<T = any> implements IresponseBase<T> {
  public code: string;
  public message: string;
  public status: number;
  public data?: T;

  constructor(
    responseCode: { code: string; message: string; status: number; data?: T },
    data?: T
  ) {
    Object.assign(this, responseCode);
    this.data = data;
  }
}

export class ResponseQuery<T = any> implements IresponseBase<T> {
  public code: string;
  public message: string;
  public status: number;
  // public pagination?: Ipaginator;

  constructor(
    responseCode: { code: string; message: string; status: number; data?: T },
    public data: T,
    page: number,
    limit: number,
    total: number
  ) {
    Object.assign(this, responseCode);
  }
}
