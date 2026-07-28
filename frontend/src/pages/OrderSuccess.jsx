import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import axiosClient from '../api/axiosClient'

export default function OrderSuccess() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    axiosClient.get(`/orders/${id}`).then(({ data }) => setOrder(data)).catch(() => {})
  }, [id])

  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <CheckCircle2 size={64} className="mx-auto text-green-500" />
      <h1 className="text-3xl font-bold mt-6">Payment Successful!</h1>
      <p className="text-gray-500 mt-2">Your order has been placed and is being processed.</p>

      {order && (
        <div className="card p-6 mt-8 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Order Number</span>
            <span className="font-semibold">{order.orderNumber}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Status</span>
            <span className="font-semibold">{order.status}</span>
          </div>
          <div className="flex justify-between mb-4">
            <span className="text-gray-500">Total</span>
            <span className="font-bold text-lg">${order.totalAmount.toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>{item.productName} × {item.quantity}</span>
                <span>${item.lineTotal.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center mt-8">
        <Link to="/orders" className="btn-secondary">View Orders</Link>
        <Link to="/products" className="btn-primary">Continue Shopping</Link>
      </div>
    </div>
  )
}
