import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CatalogContent from '../CatalogContent'
import { CartProvider } from '@/contexts/CartContext'

// Mock the product data
jest.mock('@/data/products', () => ({
  products: [
    {
      id: 'prod1',
      name_ar: 'زيت موتول',
      category_id: 'c1',
      brand_id: 'b13',
      type: 'part',
      price: 150,
      currency: 'ريال',
      status: 'published',
      description: 'زيت محرك عالي الجودة',
      created_at: '2025-01-15T00:00:00Z',
      is_available: true,
    },
    {
      id: 'prod2',
      name_ar: 'فلتر هواء',
      category_id: 'c2',
      brand_id: 'b34',
      type: 'part',
      price: 80,
      currency: 'ريال',
      status: 'published',
      description: 'فلتر هواء أصلي',
      created_at: '2025-01-16T00:00:00Z',
      is_available: true,
    },
  ],
  categories: [
    { id: 'c1', name_ar: 'زيوت', type: 'part', created_at: '2025-01-15T00:00:00Z' },
    { id: 'c2', name_ar: 'فلاتر', type: 'part', created_at: '2025-01-15T00:00:00Z' },
  ],
  brands: [
    { id: 'b13', name: 'Motul', created_at: '2025-01-15T00:00:00Z' },
    { id: 'b34', name: 'Hiflofiltro', created_at: '2025-01-15T00:00:00Z' },
  ],
}))

// Override the global mock for this test file
jest.mock('next/navigation', () => {
  const mockGet = jest.fn().mockReturnValue(null)
  return {
    useRouter: jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    })),
    useSearchParams: jest.fn(() => ({
      get: mockGet,
    })),
    usePathname: jest.fn(() => ''),
    useParams: jest.fn(() => ({})),
  }
})

describe('CatalogContent - Filter Tests', () => {
  const renderWithCart = (component: React.ReactElement) => {
    return render(<CartProvider>{component}</CartProvider>)
  }

  it('should render all products initially', () => {
    renderWithCart(<CatalogContent />)
    expect(screen.getByText('زيت موتول')).toBeInTheDocument()
    expect(screen.getByText('فلتر هواء')).toBeInTheDocument()
  })

  it('should filter by category when chip is clicked', async () => {
    renderWithCart(<CatalogContent />)

    // Click on "زيوت" category chip
    const oilCategoryButton = screen.getByRole('button', { name: 'زيوت' })
    fireEvent.click(oilCategoryButton)

    await waitFor(() => {
      expect(screen.getByText('زيت موتول')).toBeInTheDocument()
      expect(screen.queryByText('فلتر هواء')).not.toBeInTheDocument()
    })
  })

  it('should filter by brand when chip is clicked', async () => {
    renderWithCart(<CatalogContent />)

    // Click on "Motul" brand chip
    const motulButton = screen.getByRole('button', { name: 'Motul' })
    fireEvent.click(motulButton)

    await waitFor(() => {
      expect(screen.getByText('زيت موتول')).toBeInTheDocument()
      expect(screen.queryByText('فلتر هواء')).not.toBeInTheDocument()
    })
  })

  it('should search products by name', async () => {
    renderWithCart(<CatalogContent />)

    const searchInput = screen.getByPlaceholderText('ابحث عن منتج...')
    fireEvent.change(searchInput, { target: { value: 'زيت' } })

    await waitFor(() => {
      expect(screen.getByText('زيت موتول')).toBeInTheDocument()
      expect(screen.queryByText('فلتر هواء')).not.toBeInTheDocument()
    })
  })

  it('should clear all filters when "مسح الفلاتر" is clicked', async () => {
    renderWithCart(<CatalogContent />)

    // Apply category filter
    const oilCategoryButton = screen.getByRole('button', { name: 'زيوت' })
    fireEvent.click(oilCategoryButton)

    await waitFor(() => {
      expect(screen.getByText('مسح الفلاتر ✕')).toBeInTheDocument()
    })

    // Clear filters
    const clearButton = screen.getByText('مسح الفلاتر ✕')
    fireEvent.click(clearButton)

    await waitFor(() => {
      expect(screen.getByText('زيت موتول')).toBeInTheDocument()
      expect(screen.getByText('فلتر هواء')).toBeInTheDocument()
    })
  })

  it('should show product count correctly', () => {
    renderWithCart(<CatalogContent />)
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('منتج')).toBeInTheDocument()
  })

  it('should respect initial category from URL params', () => {
    // For this test, we need to mock the searchParams to return c1
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { useSearchParams } = require('next/navigation')
    useSearchParams.mockReturnValueOnce({
      get: jest.fn((param) => (param === 'category' ? 'c1' : null)),
    })

    renderWithCart(<CatalogContent />)

    // Should only show products from category c1
    expect(screen.getByText('زيت موتول')).toBeInTheDocument()
    expect(screen.queryByText('فلتر هواء')).not.toBeInTheDocument()
  })
})
