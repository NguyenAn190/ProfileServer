import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
    Logger,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  
  @Catch()
  export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);
  
    catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      
      const status = exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
  
      let message: any = exception instanceof HttpException
        ? exception.getResponse()
        : 'Lỗi hệ thống vui lòng thử lại sau';
  
      // Ensure the message is always a string
      if (typeof message === 'object') {
        message = (message as any).message || JSON.stringify(message);
      }
  
      // Log the exception
      this.logger.error(
        `HTTP Status: ${status} Error Message: ${message}`,
        (exception as Error).stack,
      );
  
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        message,
      });
    }
  }
  