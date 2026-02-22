import { describe, it, expect, beforeEach } from 'vitest'
import { ShoppingCart } from './shoppingCart'

describe('ShoppingCart', () => {
  let cart: ShoppingCart

  beforeEach(() => {
    cart = new ShoppingCart()
  })

  it('starts empty', () => {
    expect(cart.getItems()).toEqual([])
  })

  it('adds an item', () => {
    cart.addItem({ id: '1', name: 'Apple', price: 1.00, quantity: 1 })
    expect(cart.getItems()).toHaveLength(1)
    expect(cart.getItems()[0].name).toBe('Apple')
  })

  it('removes an item by id', () => {
    cart.addItem({ id: '1', name: 'Apple', price: 1.00, quantity: 1 })
    cart.addItem({ id: '2', name: 'Banana', price: 0.50, quantity: 2 })
    cart.removeItem('1')
    expect(cart.getItems()).toHaveLength(1)
    expect(cart.getItems()[0].id).toBe('2')
  })

  it('calculates the total price across all items and quantities', () => {
    cart.addItem({ id: '1', name: 'Apple', price: 1.00, quantity: 3 })
    cart.addItem({ id: '2', name: 'Banana', price: 0.50, quantity: 2 })
    expect(cart.getTotal()).toBe(4.00)
  })

  it('applies a percentage discount code', () => {
    cart.addItem({ id: '1', name: 'Apple', price: 10.00, quantity: 1 })
    cart.applyDiscount('SAVE10') // 10% off
    expect(cart.getTotal()).toBe(9.00)
  })

  it('applies a fixed discount code', () => {
    cart.addItem({ id: '1', name: 'Apple', price: 20.00, quantity: 1 })
    cart.applyDiscount('FLAT5') // $5 off
    expect(cart.getTotal()).toBe(15.00)
  })

  it('ignores an invalid discount code', () => {
    cart.addItem({ id: '1', name: 'Apple', price: 10.00, quantity: 1 })
    cart.applyDiscount('BOGUS')
    expect(cart.getTotal()).toBe(10.00)
  })
})
