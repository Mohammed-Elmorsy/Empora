import { Decimal } from '@prisma/client/runtime/library';

export class ProductResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number | Decimal;
  comparePrice: number | Decimal | null;
  sku: string;
  stock: number;
  images: string[];
  categoryId: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
  };
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedProductResponseDto {
  data: ProductResponseDto[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
