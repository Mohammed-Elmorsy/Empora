import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
  PaginatedProductResponseDto,
  ProductResponseDto,
} from './dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async findAll(@Query() filterDto: ProductFilterDto): Promise<PaginatedProductResponseDto> {
    return this.productService.findAll(filterDto);
  }

  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string): Promise<ProductResponseDto> {
    return this.productService.findBySlug(slug);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.findOne(id);
  }

  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.create(createProductDto);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ProductResponseDto> {
    return this.productService.remove(id);
  }
}
