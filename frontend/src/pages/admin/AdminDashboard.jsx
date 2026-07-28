import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import axiosClient from '../../api/axiosClient'

const STATUSES = ['PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED']

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const loadOrders = () => {
    setLoading(true)
    axiosClient.get('/admin/orders').then(({ data }) => setOrders(data.content)).finally(() => setLoading(false))
  }

  useEffect(() => { loadOrders() }, [])

  const handleStatusChange = async (id, status) => {
    try {
      await axiosClient.patch(`/admin/orders/${id}/status`, { status })
      toast.success('Order status updated')
      loadOrders()
    } catch {
      toast.error('Failed to update status')
    }
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm text-gray-500">Total Orders</p><p className="text-2xl font-bold">{orders.length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Revenue</p><p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Pending</p><p className="text-2xl font-bold">{orders.filter(o => o.status === 'PENDING').length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Delivered</p><p className="text-2xl font-bold">{orders.filter(o => o.status === 'DELIVERED').length}</p></div>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left text-gray-500">
            <tr>
              <th className="p-4">Order #</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4 font-medium">{o.orderNumber}</td>
                <td className="p-4">{new Date(o.createdAt).toLocaleDateString()}</td>
                <td className="p-4">${o.totalAmount.toFixed(2)}</td>
                <td className="p-4">
                  <select
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                    className="input-field w-auto py-1.5"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && orders.length === 0 && <p className="p-6 text-center text-gray-500">No orders yet.</p>}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        User/seller/category/coupon management screens follow the same pattern as this order table and the Seller dashboard —
        not all are wired to endpoints yet (see backend README for what's schema-only).
      </p>
    </div>
  )
}
