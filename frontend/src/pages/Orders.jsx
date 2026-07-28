import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosClient from '../api/axiosClient'

const STATUS_COLORS = {
  PENDING: 'bg-gray-100 text-gray-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PACKED: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  OUT_FOR_DELIVERY: 'bg-amber-100 text-amber-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  RETURNED: 'bg-orange-100 text-orange-700'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axiosClient.get('/orders').then(({ data }) => setOrders(data.content)).finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>

      {loading && <p className="text-gray-500">Loading...</p>}
      {!loading && orders.length === 0 && (
        <p className="text-gray-500">You haven't placed any orders yet. <Link to="/products" className="text-primary-600 hover:underline">Start shopping</Link></p>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/order-success/${order.id}`} className="card p-5 flex items-center justify-between block">
            <div>
              <p className="font-semibold">{order.orderNumber}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)</p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                {order.status.replaceAll('_', ' ')}
              </span>
              <span className="font-bold">${order.totalAmount.toFixed(2)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
