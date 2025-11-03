import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health/health.controller';
import { AuthProxyController } from './proxy/auth-proxy.controller';
import { ProductProxyController } from './proxy/product-proxy.controller';
import { CategoriesProxyController } from './proxy/categories-proxy.controller';
import { ProxyService } from './proxy/proxy.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [
    HealthController,
    AuthProxyController,
    ProductProxyController,
    CategoriesProxyController,
  ],
  providers: [ProxyService],
})
export class GatewayModule {}
