import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // RabbitMQ will be added in next milestone
  ],
  controllers: [HealthController],
  providers: [PrismaService],
})
export class AuthServiceModule {}
