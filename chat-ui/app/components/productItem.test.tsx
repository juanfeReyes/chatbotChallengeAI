import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductItem from './productItem';

describe('ProductItem', () => {
  const defaultProps = {
    name: 'Tropical Print Bikini',
    price: 39.99,
    quantityDiscount: '10% off for 3+',
    imageUrl: 'https://example.com/bikini.jpg',
  };

  it('renders product name, price, discount, and image', () => {
    render(<ProductItem {...defaultProps} />);
    expect(screen.getByText('Tropical Print Bikini')).toBeInTheDocument();
    expect(screen.getByText('$39.99')).toBeInTheDocument();
    expect(screen.getByText('10% off for 3+')).toBeInTheDocument();
    const img = screen.getByAltText('Tropical Print Bikini');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/bikini.jpg');
  });

  it('renders price with two decimals', () => {
    render(<ProductItem {...defaultProps} price={25} />);
    expect(screen.getByText('$25.00')).toBeInTheDocument();
  });

  it('renders different props correctly', () => {
    render(
      <ProductItem
        name="Boho Beach Cover-Up"
        price={29.5}
        quantityDiscount="15% off for 2+"
        imageUrl="https://example.com/coverup.jpg"
      />
    );
    expect(screen.getByText('Boho Beach Cover-Up')).toBeInTheDocument();
    expect(screen.getByText('$29.50')).toBeInTheDocument();
    expect(screen.getByText('15% off for 2+')).toBeInTheDocument();
    expect(screen.getByAltText('Boho Beach Cover-Up')).toHaveAttribute('src', 'https://example.com/coverup.jpg');
  });
});
