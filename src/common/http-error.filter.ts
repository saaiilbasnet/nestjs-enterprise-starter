// import {
//   ArgumentsHost,
//   Catch,
//   ExceptionFilter,
//   HttpException,
// } from '@nestjs/common';
// import * as Sentry from '@sentry/nestjs';
// import { env } from 'src/config/env';
// import { ObjectErrMsgType } from './common.type';

// @Catch()
// export class CatchAllExceptionFilter implements ExceptionFilter {
//   catch(exception: unknown, host: ArgumentsHost): void {
//     const ctx = host.switchToHttp();
//     const response = ctx.getResponse();
//     let message: string[];
//     let status: number;
//     if (exception instanceof HttpException) {
//       const errorResponse = exception.getResponse() as ObjectErrMsgType;

//       message = errorResponse.message
//         ? (errorResponse.message as unknown as string[])
//         : (errorResponse as unknown as string[]);
//       status = exception.getStatus();
//       if (typeof message == 'string') message = [message];
//     } else {
//       if (env.NODE_ENV != 'local') Sentry.captureException(exception);
//       else console.log(exception);
//       message = ['Internal server error'];
//       status = 500;
//     }
//     response.status(status).json({
//       statusCode: status,
//       message,
//     });
//   }
// }
