import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';

@Controller('auth')
export class AuthProxyController {
  private readonly serviceUrl: string;

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.serviceUrl = this.configService.get('AUTH_SERVICE_URL');
  }

  @All('*')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    const path = req.url.replace('/api/auth', '');
    const method = req.method;
    const data = req.body;
    const headers = req.headers as Record<string, string>;
    const params = req.query;

    try {
      const result = await this.proxyService.forwardRequest(
        this.serviceUrl,
        path || '/',
        method,
        data,
        headers,
        params,
      );

      return res.json(result);
    } catch (error) {
      return res.status(error.status || 500).json(error.response || error);
    }
  }
}
