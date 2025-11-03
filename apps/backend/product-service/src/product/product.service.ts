import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product, Prisma } from '@prisma/client';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: ProductFilterDto): Promise<PaginatedResponse<Product>> {
    const {
      page = 1,
      limit = 10,
      categoryId,
      minPrice,
      maxPrice,
      search,
      isFeatured,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = filters;

    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = { isActive: true };

    // Apply filters
    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: { category: true },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.prisma.product.findFirst({
      where: { slug, isActive: true },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug ${slug} not found`);
    }

    return product;
  }

  async create(createDto: CreateProductDto): Promise<Product> {
    // Check if slug already exists
    const existingProductBySlug = await this.prisma.product.findFirst({
      where: { slug: createDto.slug },
    });

    if (existingProductBySlug) {
      throw new BadRequestException(`Product with slug ${createDto.slug} already exists`);
    }

    // Check if SKU already exists
    const existingProductBySku = await this.prisma.product.findFirst({
      where: { sku: createDto.sku },
    });

    if (existingProductBySku) {
      throw new BadRequestException(`Product with SKU ${createDto.sku} already exists`);
    }

    return this.prisma.product.create({
      data: createDto,
      include: { category: true },
    });
  }

  async update(id: string, updateDto: UpdateProductDto): Promise<Product> {
    // Check if product exists
    await this.findOne(id);

    // If updating slug, check it doesn't exist on another product
    if (updateDto.slug) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { slug: updateDto.slug },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new BadRequestException(`Product with slug ${updateDto.slug} already exists`);
      }
    }

    // If updating SKU, check it doesn't exist on another product
    if (updateDto.sku) {
      const existingProduct = await this.prisma.product.findFirst({
        where: { sku: updateDto.sku },
      });

      if (existingProduct && existingProduct.id !== id) {
        throw new BadRequestException(`Product with SKU ${updateDto.sku} already exists`);
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateDto,
      include: { category: true },
    });
  }

  async remove(id: string): Promise<Product> {
    // Check if product exists
    await this.findOne(id);

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
