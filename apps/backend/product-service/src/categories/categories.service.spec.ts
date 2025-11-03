import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let prisma: PrismaService;

  const mockCategory = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    image: 'electronics.jpg',
    parentId: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockCategoryWithRelations = {
    ...mockCategory,
    parent: null,
    children: [
      {
        id: '123e4567-e89b-12d3-a456-426614174001',
        name: 'Smartphones',
        slug: 'smartphones',
        description: 'Mobile phones',
        image: 'smartphones.jpg',
        parentId: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
  };

  const mockPrismaService = {
    category: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all categories ordered by name', async () => {
      const categories = [mockCategory];
      mockPrismaService.category.findMany.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: {
          name: 'asc',
        },
      });
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no categories exist', async () => {
      mockPrismaService.category.findMany.mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      mockPrismaService.category.findMany.mockRejectedValue(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findOne', () => {
    it('should return a category by id with parent and children', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(mockCategoryWithRelations);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockCategoryWithRelations);
      expect(prisma.category.findUnique).toHaveBeenCalledWith({
        where: { id: '123e4567-e89b-12d3-a456-426614174000' },
        include: {
          children: true,
          parent: true,
        },
      });
      expect(prisma.category.findUnique).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException when category does not exist', async () => {
      mockPrismaService.category.findUnique.mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow(NotFoundException);
      await expect(service.findOne('non-existent-id')).rejects.toThrow(
        'Category with ID non-existent-id not found',
      );
    });

    it('should handle database errors', async () => {
      mockPrismaService.category.findUnique.mockRejectedValue(new Error('Database error'));

      await expect(service.findOne('123e4567-e89b-12d3-a456-426614174000')).rejects.toThrow(
        'Database error',
      );
    });

    it('should include parent and children relations', async () => {
      const categoryWithParent = {
        ...mockCategory,
        id: '123e4567-e89b-12d3-a456-426614174001',
        parentId: '123e4567-e89b-12d3-a456-426614174000',
        parent: mockCategory,
        children: [],
      };
      mockPrismaService.category.findUnique.mockResolvedValue(categoryWithParent);

      const result = await service.findOne('123e4567-e89b-12d3-a456-426614174001');

      expect(result).toEqual(categoryWithParent);
      expect(result.parent).toBeDefined();
      expect(result.children).toBeDefined();
    });
  });
});
