import { render, screen } from '@testing-library/react';
import { ProductList } from './ProductList';
import type { Product } from '@/lib/api/products';

// Mock ProductCard component
jest.mock('./ProductCard', () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-card-${product.id}`}>{product.name}</div>
  ),
}));

describe('ProductList', () => {
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      slug: 'product-1',
      description: 'Description 1',
      price: '99.99',
      comparePrice: null,
      sku: 'SKU-001',
      stock: 10,
      images: ['image1.jpg'],
      categoryId: 'cat-1',
      isActive: true,
      isFeatured: false,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Product 2',
      slug: 'product-2',
      description: 'Description 2',
      price: '149.99',
      comparePrice: null,
      sku: 'SKU-002',
      stock: 5,
      images: ['image2.jpg'],
      categoryId: 'cat-1',
      isActive: true,
      isFeatured: false,
      createdAt: '2024-01-02',
      updatedAt: '2024-01-02',
    },
    {
      id: '3',
      name: 'Product 3',
      slug: 'product-3',
      description: 'Description 3',
      price: '199.99',
      comparePrice: null,
      sku: 'SKU-003',
      stock: 15,
      images: ['image3.jpg'],
      categoryId: 'cat-1',
      isActive: true,
      isFeatured: false,
      createdAt: '2024-01-03',
      updatedAt: '2024-01-03',
    },
  ];

  it('should render all products', () => {
    render(<ProductList products={mockProducts} />);

    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
  });

  it('should render product names', () => {
    render(<ProductList products={mockProducts} />);

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    expect(screen.getByText('Product 2')).toBeInTheDocument();
    expect(screen.getByText('Product 3')).toBeInTheDocument();
  });

  it('should render empty state when no products', () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText(/no products found/i)).toBeInTheDocument();
  });

  it('should display empty state message', () => {
    render(<ProductList products={[]} />);

    expect(screen.getByText(/try adjusting your filters or search/i)).toBeInTheDocument();
  });

  it('should render in grid layout', () => {
    const { container } = render(<ProductList products={mockProducts} />);
    const grid = container.querySelector('[data-testid="product-grid"]');

    expect(grid).toBeInTheDocument();
    expect(grid).toHaveClass('grid');
  });

  it('should render correct number of products', () => {
    render(<ProductList products={mockProducts} />);

    const productCards = screen.getAllByTestId(/^product-card-/);
    expect(productCards).toHaveLength(3);
  });

  it('should handle single product', () => {
    render(<ProductList products={[mockProducts[0]]} />);

    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-2')).not.toBeInTheDocument();
  });

  it('should display loading state when isLoading is true', () => {
    render(<ProductList products={[]} isLoading={true} />);

    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('should not display loading state when isLoading is false', () => {
    render(<ProductList products={mockProducts} isLoading={false} />);

    expect(screen.queryByText(/loading products/i)).not.toBeInTheDocument();
  });

  it('should render loading skeletons when loading', () => {
    render(<ProductList products={[]} isLoading={true} />);

    const skeletons = screen.getAllByTestId('product-skeleton');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
