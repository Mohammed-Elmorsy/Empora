import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let service: CategoriesService;

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

  const mockCategoriesService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = [mockCategory];
      mockCategoriesService.findAll.mockResolvedValue(categories);

      const result = await controller.findAll();

      expect(result).toEqual(categories);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no categories exist', async () => {
      mockCategoriesService.findAll.mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single category with relations', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategoryWithRelations);

      const result = await controller.findOne('123e4567-e89b-12d3-a456-426614174000');

      expect(result).toEqual(mockCategoryWithRelations);
      expect(service.findOne).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });

    it('should call service.findOne with correct id', async () => {
      const categoryId = '123e4567-e89b-12d3-a456-426614174000';
      mockCategoriesService.findOne.mockResolvedValue(mockCategoryWithRelations);

      await controller.findOne(categoryId);

      expect(service.findOne).toHaveBeenCalledWith(categoryId);
    });
  });
});
