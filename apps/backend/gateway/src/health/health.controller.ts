import { Controller, Get } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Controller('health')
export class HealthController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async checkHealth() {
    const services = [
      { name: 'auth-service', url: this.configService.get('AUTH_SERVICE_URL') },
      { name: 'product-service', url: this.configService.get('PRODUCT_SERVICE_URL') },
      { name: 'cart-service', url: this.configService.get('CART_SERVICE_URL') },
      { name: 'order-service', url: this.configService.get('ORDER_SERVICE_URL') },
      { name: 'notification-service', url: this.configService.get('NOTIFICATION_SERVICE_URL') },
    ];

    const healthChecks = await Promise.allSettled(
      services.map(async (service) => {
        try {
          const response = await firstValueFrom(
            this.httpService.get(`${service.url}/health`, {
              timeout: 3000,
            }),
          );
          return {
            service: service.name,
            status: 'ok',
            data: response.data,
          };
        } catch (error) {
          return {
            service: service.name,
            status: 'error',
            error: error.message,
          };
        }
      }),
    );

    const results = healthChecks.map((result) =>
      result.status === 'fulfilled' ? result.value : result.reason,
    );

    const allHealthy = results.every((r) => r.status === 'ok');

    return {
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      gateway: 'ok',
      services: results,
    };
  }

  @Get('gateway')
  getGatewayHealth() {
    return {
      status: 'ok',
      service: 'gateway',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
    };
  }
}
