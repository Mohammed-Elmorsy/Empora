import { Controller, All, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ProxyService } from './proxy.service';

@Controller('categories')
export class CategoriesProxyController {
  private readonly serviceUrl: string;

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {
    this.serviceUrl = this.configService.get('PRODUCT_SERVICE_URL');
  }

  @All()
  async proxyRootRequest(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  @All('*')
  async proxyRequest(@Req() req: Request, @Res() res: Response) {
    return this.handleProxy(req, res);
  }

  private async handleProxy(req: Request, res: Response) {
    // Extract the path after /api/categories and prepend /categories for the service
    const fullPath = req.url.replace('/api/categories', '');
    const pathOnly = fullPath.split('?')[0] || '';
    const servicePath = `/categories${pathOnly}`;
    const method = req.method;
    const data = req.body;
    const headers = req.headers as Record<string, string>;
    const params = req.query;

    try {
      const result = await this.proxyService.forwardRequest(
        this.serviceUrl,
        servicePath,
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
