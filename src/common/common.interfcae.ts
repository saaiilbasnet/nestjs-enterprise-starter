export interface IUpdateResult {
  message: string;
}
export interface IProcInterMediateResponse<T> {
  in_out_response_status: 1 | 0;
  in_out_response_message: string;
  in_out_response_data: T;
}
