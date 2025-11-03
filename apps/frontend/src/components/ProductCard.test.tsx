import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/api/products';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line
    return <img {...props} />;
  },
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

describe('ProductCard', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    slug: 'test-product',
    description: 'Test description',
    price: '99.99',
    comparePrice: '129.99',
    sku: 'TEST-001',
    stock: 10,
    images: ['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    categoryId: 'cat-1',
    category: {
      id: 'cat-1',
      name: 'Electronics',
      slug: 'electronics',
      description: null,
      image: null,
      parentId: null,
    },
    isActive: true,
    isFeatured: false,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  };

  it('should render product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('should render product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render compare price when available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$129.99')).toBeInTheDocument();
  });

  it('should not render compare price when not available', () => {
    const productWithoutComparePrice = { ...mockProduct, comparePrice: null };
    render(<ProductCard product={productWithoutComparePrice} />);
    expect(screen.queryByText('$129.99')).not.toBeInTheDocument();
  });

  it('should render product image', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/image1.jpg');
  });

  it('should use placeholder image when no images available', () => {
    const productWithoutImages = { ...mockProduct, images: [] };
    render(<ProductCard product={productWithoutImages} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', expect.stringContaining('placeholder'));
  });

  it('should link to product detail page', () => {
    render(<ProductCard product={mockProduct} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/products/test-product');
  });

  it('should show "Out of Stock" badge when stock is 0', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });

  it('should not show "Out of Stock" badge when stock is available', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText('Out of Stock')).not.toBeInTheDocument();
  });

  it('should show "Featured" badge when product is featured', () => {
    const featuredProduct = { ...mockProduct, isFeatured: true };
    render(<ProductCard product={featuredProduct} />);
    expect(screen.getByText('Featured')).toBeInTheDocument();
  });

  it('should not show "Featured" badge when product is not featured', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.queryByText('Featured')).not.toBeInTheDocument();
  });

  it('should render category name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Electronics')).toBeInTheDocument();
  });

  it('should calculate discount percentage', () => {
    render(<ProductCard product={mockProduct} />);
    // (129.99 - 99.99) / 129.99 * 100 = 23%
    expect(screen.getByText('23% off')).toBeInTheDocument();
  });

  it('should be keyboard accessible', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);

    const link = screen.getByRole('link');
    await user.tab();
    expect(link).toHaveFocus();
  });
});
