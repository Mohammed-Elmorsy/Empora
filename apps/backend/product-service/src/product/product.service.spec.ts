import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SortBy, SortOrder } from './dto/product-filter.dto';

describe('ProductService', () => {
  let service: ProductService;
  let prisma: PrismaService;

  const mockPrismaService = {
    product: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test Description',
    price: 99.99,
    comparePrice: 129.99,
    sku: 'TEST-001',
    stock: 10,
    images: ['image1.jpg', 'image2.jpg'],
    categoryId: '123e4567-e89b-12d3-a456-426614174001',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products with default pagination', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(1);

      const result = await service.findAll({});

      expect(result).toEqual({
        data: mockProducts,
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      });
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
    });

    it('should return products with custom pagination', async () => {
      const mockProducts = [mockProduct];
      mockPrismaService.product.findMany.mockResolvedValue(mockProducts);
      mockPrismaService.product.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 2, limit: 5 });

      expect(result.meta).toEqual({
        total: 25,
        page: 2,
        limit: 5,
        totalPages: 5,
      });
      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 5,
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
    });

    it('should filter products by category', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174001';
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ categoryId });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true, categoryId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
    });

    it('should filter products by price range', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ minPrice: 50, maxPrice: 150 });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          price: { gte: 50, lte: 150 },
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
    });

    it('should search products by name', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ search: 'test' });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: {
          isActive: true,
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
    });

    it('should filter featured products', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ isFeatured: true });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true, isFeatured: true },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { category: true },
      });
    });

    it('should sort products by price ascending', async () => {
      mockPrismaService.product.findMany.mockResolvedValue([mockProduct]);
      mockPrismaService.product.count.mockResolvedValue(1);

      await service.findAll({ sortBy: SortBy.PRICE, sortOrder: SortOrder.ASC });

      expect(prisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        skip: 0,
        take: 10,
        orderBy: { price: 'asc' },
        include: { category: true },
      });
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findUnique).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        include: { category: true },
      });
    });

    it('should throw NotFoundException when product not found', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findBySlug', () => {
    it('should return a product by slug', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.findBySlug(mockProduct.slug);

      expect(result).toEqual(mockProduct);
      expect(prisma.product.findFirst).toHaveBeenCalledWith({
        where: { slug: mockProduct.slug, isActive: true },
        include: { category: true },
      });
    });

    it('should throw NotFoundException when product not found by slug', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null);

      await expect(service.findBySlug('non-existent-slug')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    const createDto = {
      name: 'New Product',
      slug: 'new-product',
      description: 'New Description',
      price: 199.99,
      sku: 'NEW-001',
      stock: 5,
      categoryId: '123e4567-e89b-12d3-a456-426614174001',
      images: ['new-image.jpg'],
    };

    it('should create a new product', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(null); // No duplicate
      mockPrismaService.product.create.mockResolvedValue({
        ...mockProduct,
        ...createDto,
      });

      const result = await service.create(createDto);

      expect(result).toMatchObject(createDto);
      expect(prisma.product.create).toHaveBeenCalledWith({
        data: createDto,
        include: { category: true },
      });
    });

    it('should throw BadRequestException if slug already exists', async () => {
      mockPrismaService.product.findFirst.mockResolvedValue(mockProduct);

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(prisma.product.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if SKU already exists', async () => {
      mockPrismaService.product.findFirst
        .mockResolvedValueOnce(null) // slug check passes
        .mockResolvedValueOnce(mockProduct); // sku check fails

      await expect(service.create(createDto)).rejects.toThrow(BadRequestException);
      expect(prisma.product.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Product',
      price: 149.99,
    };

    it('should update a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.update.mockResolvedValue({
        ...mockProduct,
        ...updateDto,
      });

      const result = await service.update(mockProduct.id, updateDto);

      expect(result).toMatchObject(updateDto);
      expect(prisma.product.update).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
        data: updateDto,
        include: { category: true },
      });
    });

    it('should throw NotFoundException when updating non-existent product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.update('non-existent-id', updateDto)).rejects.toThrow(NotFoundException);
      expect(prisma.product.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException if updating slug to existing one', async () => {
      const updateWithSlug = { slug: 'existing-slug' };
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.findFirst.mockResolvedValue({
        ...mockProduct,
        id: 'different-id',
      });

      await expect(service.update(mockProduct.id, updateWithSlug)).rejects.toThrow(
        BadRequestException,
      );
      expect(prisma.product.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(mockProduct);
      mockPrismaService.product.delete.mockResolvedValue(mockProduct);

      const result = await service.remove(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(prisma.product.delete).toHaveBeenCalledWith({
        where: { id: mockProduct.id },
      });
    });

    it('should throw NotFoundException when deleting non-existent product', async () => {
      mockPrismaService.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('non-existent-id')).rejects.toThrow(NotFoundException);
      expect(prisma.product.delete).not.toHaveBeenCalled();
    });
  });
});
