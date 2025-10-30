import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ProxyService {
  constructor(private readonly httpService: HttpService) {}

  async forwardRequest(
    serviceUrl: string,
    path: string,
    method: string,
    data?: any,
    headers?: Record<string, string>,
    params?: Record<string, any>,
  ): Promise<any> {
    try {
      const config: AxiosRequestConfig = {
        method,
        url: `${serviceUrl}${path}`,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        params,
      };

      if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
        config.data = data;
      }

      const response = await firstValueFrom(this.httpService.request(config));

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new HttpException(error.response.data, error.response.status);
      }

      throw new HttpException(
        {
          message: 'Service unavailable',
          error: error.message,
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
