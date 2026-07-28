import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Trash2, Minus, Plus } from 'lucide-react'
import { fetchCart, updateCartItem, removeCartItem } from '../features/cart/cartSlice'

export default function Cart() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, subtotal, status } = useSelector((s) => s.cart)
  const { user } = useSelector((s) => s.auth)

  useEffect(() => {
    if (user) dispatch(fetchCart())
  }, [dispatch, user])

  if (!user) {
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <p className="text-gray-500">Please sign in to view your cart.</p>
        <Link to="/login" className="btn-primary inline-flex mt-4">Sign In</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>

      {status === 'succeeded' && items.length === 0 && (
        <p className="text-gray-500 py-10 text-center">Your cart is empty. <Link to="/products" className="text-primary-600 hover:underline">Browse products</Link></p>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="card p-4 flex gap-4">
              <img src={item.productImageUrl || 'https://placehold.co/100'} alt={item.productName} className="h-24 w-24 rounded-xl object-cover" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.productName}</h3>
                <p className="text-sm text-gray-500 mt-1">${item.unitPrice.toFixed(2)} each</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex items-center border rounded-lg border-gray-300 dark:border-gray-700">
                    <button className="p-2" onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity - 1 }))}>
                      <Minus size={14} />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button className="p-2" disabled={item.quantity >= item.availableStock}
                      onClick={() => dispatch(updateCartItem({ itemId: item.id, quantity: item.quantity + 1 }))}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button onClick={() => dispatch(removeCartItem(item.id))} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="font-bold">${item.lineTotal.toFixed(2)}</div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="card p-6 h-fit">
            <h2 className="font-bold text-lg mb-4">Order Summary</h2>
            <div className="flex justify-between text-sm mb-2">
              <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">Shipping & discounts calculated at checkout.</p>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  )
}
