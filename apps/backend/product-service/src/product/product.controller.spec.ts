import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './dto';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test Description',
    price: 99.99,
    comparePrice: 129.99,
    sku: 'TEST-001',
    stock: 10,
    images: ['image1.jpg'],
    categoryId: '123e4567-e89b-12d3-a456-426614174001',
    isActive: true,
    isFeatured: false,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockPaginatedResponse = {
    data: [mockProduct],
    meta: {
      total: 1,
      page: 1,
      limit: 10,
      totalPages: 1,
    },
  };

  const mockProductService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    findBySlug: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const filterDto: ProductFilterDto = { page: 1, limit: 10 };
      mockProductService.findAll.mockResolvedValue(mockPaginatedResponse);

      const result = await controller.findAll(filterDto);

      expect(result).toEqual(mockPaginatedResponse);
      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });

    it('should pass filter parameters to service', async () => {
      const filterDto: ProductFilterDto = {
        page: 2,
        limit: 20,
        categoryId: '123e4567-e89b-12d3-a456-426614174001',
        minPrice: 50,
        maxPrice: 150,
        search: 'test',
        isFeatured: true,
      };
      mockProductService.findAll.mockResolvedValue(mockPaginatedResponse);

      await controller.findAll(filterDto);

      expect(service.findAll).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should return a single product by ID', async () => {
      mockProductService.findOne.mockResolvedValue(mockProduct);

      const result = await controller.findOne(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  describe('findBySlug', () => {
    it('should return a single product by slug', async () => {
      mockProductService.findBySlug.mockResolvedValue(mockProduct);

      const result = await controller.findBySlug(mockProduct.slug);

      expect(result).toEqual(mockProduct);
      expect(service.findBySlug).toHaveBeenCalledWith(mockProduct.slug);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const createDto: CreateProductDto = {
        name: 'New Product',
        slug: 'new-product',
        description: 'New Description',
        price: 199.99,
        sku: 'NEW-001',
        stock: 5,
        categoryId: '123e4567-e89b-12d3-a456-426614174001',
        images: ['new-image.jpg'],
      };
      mockProductService.create.mockResolvedValue({
        ...mockProduct,
        ...createDto,
      });

      const result = await controller.create(createDto);

      expect(result).toMatchObject(createDto);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateDto: UpdateProductDto = {
        name: 'Updated Product',
        price: 149.99,
      };
      const updatedProduct = { ...mockProduct, ...updateDto };
      mockProductService.update.mockResolvedValue(updatedProduct);

      const result = await controller.update(mockProduct.id, updateDto);

      expect(result).toEqual(updatedProduct);
      expect(service.update).toHaveBeenCalledWith(mockProduct.id, updateDto);
    });
  });

  describe('remove', () => {
    it('should delete a product', async () => {
      mockProductService.remove.mockResolvedValue(mockProduct);

      const result = await controller.remove(mockProduct.id);

      expect(result).toEqual(mockProduct);
      expect(service.remove).toHaveBeenCalledWith(mockProduct.id);
    });
  });
});
