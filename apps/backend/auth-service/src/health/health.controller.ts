import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async checkHealth() {
    const startTime = Date.now();

    try {
      // Check database connection
      await this.prisma.$queryRaw`SELECT 1`;
      const dbResponseTime = Date.now() - startTime;

      return {
        status: 'ok',
        service: 'auth-service',
        timestamp: new Date().toISOString(),
        database: {
          connected: true,
          responseTime: dbResponseTime,
        },
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      };
    } catch (error) {
      return {
        status: 'error',
        service: 'auth-service',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          error: error.message,
        },
      };
    }
  }
}
