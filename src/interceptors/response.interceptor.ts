import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import {
  SuccessResponse,
  SuccessResponseMultiple,
} from 'src/interface/response.interface';

export interface Response<T> {
  data: T;
}

@Injectable()
export class PageTransferResponseInterceptor<T> implements NestInterceptor<
  T,
  SuccessResponseMultiple<T> | SuccessResponse<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessResponseMultiple<T> | SuccessResponse<T>> {
    const { query } = context.switchToHttp().getRequest();
    const req = context.switchToHttp().getRequest();

    return next.handle().pipe(
      map((responseObject) => {
        const response = context.switchToHttp().getResponse();
        if (
          Array.isArray(responseObject) &&
          typeof responseObject[1] === 'number'
        ) {
          const [datas, length] = responseObject;

          const page = Number(query.page) || 1;
          const take = Number(query.take) || length || 1;
          const totalPages = Math.ceil(length / take);

          const meta = {
            length,
            totalPages,
            prev: page > 1 ? +page - 1 : null,
            next: page < totalPages ? +page + 1 : null,
          };
          return new SuccessResponseMultiple({
            status: response.statusCode,
            message: `${req.customMessage ? req.customMessage : 'success'}`,
            meta,
            data: datas,
          });
        }
        const message = responseObject?.message;
        delete responseObject?.message;
        return new SuccessResponse({
          status: response.statusCode || responseObject?.status || 200,
          message: `${req.customMessage || message || 'success'}`,
          data: responseObject?.data || responseObject || null,
        });
      }),
    );
  }
}
