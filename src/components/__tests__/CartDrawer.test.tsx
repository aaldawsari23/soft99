import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import CartDrawer from '../cart/CartDrawer'
import { CartProvider, useCart } from '@/contexts/CartContext'

// Mock window.open
const mockWindowOpen = jest.fn()
Object.defineProperty(window, 'open', {
  writable: true,
  value: mockWindowOpen,
})

// Mock the product data
jest.mock('@/data/products', () => ({
  products: [],
  categories: [],
  brands: [],
}))

jest.mock('@/data/config', () => ({
  WHATSAPP_NUMBER: '966568663381',
}))

describe('CartDrawer - WhatsApp Order Tests', () => {
  beforeEach(() => {
    mockWindowOpen.mockClear()
    localStorage.clear()
  })

  it('should show empty cart message when no items', () => {
    render(
      <CartProvider>
        <CartDrawer isOpen={true} onClose={() => {}} />
      </CartProvider>
    )

    expect(screen.getByText('السلة فارغة')).toBeInTheDocument()
  })

  it('should not show WhatsApp button when cart is empty', () => {
    render(
      <CartProvider>
        <CartDrawer isOpen={true} onClose={() => {}} />
      </CartProvider>
    )

    const whatsappButton = screen.queryByText('إرسال الطلب عبر واتساب')
    expect(whatsappButton).not.toBeInTheDocument()
  })

  it('should close drawer when close button is clicked', () => {
    const onClose = jest.fn()
    render(
      <CartProvider>
        <CartDrawer isOpen={true} onClose={onClose} />
      </CartProvider>
    )

    const closeButton = screen.getByLabelText('إغلاق')
    fireEvent.click(closeButton)

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('should display cart header', () => {
    render(
      <CartProvider>
        <CartDrawer isOpen={true} onClose={() => {}} />
      </CartProvider>
    )

    expect(screen.getByText('سلة التسوق')).toBeInTheDocument()
  })
})
