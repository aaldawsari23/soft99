import React from 'react'
import { render, screen } from '@testing-library/react'
import { useParams, notFound } from 'next/navigation'
import ProductPage from '../page'
import { CartProvider } from '@/contexts/CartContext'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'),
  notFound: jest.fn(),
  useParams: jest.fn(),
}))

// Mock the product data
jest.mock('@/data/products', () => ({
  products: [
    {
      id: 'test-product-1',
      sku: 'SKU001',
      name_ar: 'زيت موتول 5W-40',
      category_id: 'c1',
      brand_id: 'b13',
      type: 'part',
      price: 150,
      currency: 'ريال',
      status: 'published',
      description: 'زيت محرك عالي الأداء',
      created_at: '2025-01-15T00:00:00Z',
      is_available: true,
      specifications: {
        model: '5W-40',
        specification: 'Fully Synthetic',
      },
    },
  ],
  categories: [
    { id: 'c1', name_ar: 'زيوت', type: 'part', created_at: '2025-01-15T00:00:00Z' },
  ],
  brands: [
    { id: 'b13', name: 'Motul', created_at: '2025-01-15T00:00:00Z' },
  ],
}))

jest.mock('@/data/config', () => ({
  WHATSAPP_NUMBER: '966568663381',
}))

describe('ProductPage - Routing Tests', () => {
  const renderWithCart = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render product page with correct product ID', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    // Product name appears multiple times (breadcrumb + h1)
    expect(screen.getAllByText('زيت موتول 5W-40').length).toBeGreaterThan(0)

    // Price is formatted in Arabic numerals "١٥٠"
    expect(screen.getByText('١٥٠')).toBeInTheDocument()

    // Brand appears multiple times (mobile + desktop)
    expect(screen.getAllByText('Motul').length).toBeGreaterThan(0)
  })

  it('should call notFound() for invalid product ID', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'invalid-product-id' })

    // notFound() throws, so we expect it to be called
    expect(() => renderWithCart(<ProductPage />)).toThrow()
    expect(notFound).toHaveBeenCalled()
  })

  it('should display product specifications', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    expect(screen.getByText('المواصفات')).toBeInTheDocument()
    expect(screen.getByText('5W-40')).toBeInTheDocument()
    expect(screen.getByText('Fully Synthetic')).toBeInTheDocument()
  })

  it('should display product SKU', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    // SKU appears in both mobile and desktop views
    expect(screen.getAllByText('SKU001').length).toBeGreaterThan(0)
  })

  it('should show breadcrumb navigation', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    expect(screen.getByText('الرئيسية')).toBeInTheDocument()
    expect(screen.getByText('المنتجات')).toBeInTheDocument()
  })

  it('should display "متوفر" badge for available products', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    expect(screen.getByText('متوفر')).toBeInTheDocument()
  })

  it('should show price in correct format', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    // Price should be formatted with Arabic numerals
    expect(screen.getByText('١٥٠')).toBeInTheDocument()
    expect(screen.getByText('ريال')).toBeInTheDocument()
  })

  it('should render category and brand information', () => {
    ;(useParams as jest.Mock).mockReturnValue({ id: 'test-product-1' })

    renderWithCart(<ProductPage />)

    // Both may appear multiple times (mobile + desktop)
    expect(screen.getAllByText('Motul').length).toBeGreaterThan(0)
    expect(screen.getAllByText('زيوت').length).toBeGreaterThan(0)
  })
})
