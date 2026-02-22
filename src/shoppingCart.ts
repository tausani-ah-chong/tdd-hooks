export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

interface Discount {
  type: 'percentage' | 'fixed'
  value: number
}

const DISCOUNT_CODES: Record<string, Discount> = {
  SAVE10: { type: 'percentage', value: 10 },
  FLAT5: { type: 'fixed', value: 5 },
}

export class ShoppingCart {
  private items: CartItem[] = []
  private discount: Discount | null = null

  getItems(): CartItem[] {
    return this.items
  }

  addItem(item: CartItem): void {
    this.items.push(item)
  }

  removeItem(id: string): void {
    this.items = this.items.filter(item => item.id !== id)
  }

  applyDiscount(code: string): void {
    const discount = DISCOUNT_CODES[code]
    if (discount) this.discount = discount
  }

  getTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    if (!this.discount) return subtotal
    if (this.discount.type === 'percentage') {
      return subtotal * (1 - this.discount.value / 100)
    }
    return subtotal - this.discount.value
  }
}
