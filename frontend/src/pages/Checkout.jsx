import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import axiosClient from '../api/axiosClient'

const PAYMENT_METHODS = [
  { value: 'CREDIT_CARD', label: 'Credit / Debit Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'NET_BANKING', label: 'Net Banking' },
  { value: 'WALLET', label: 'Wallet' },
  { value: 'COD', label: 'Cash on Delivery' }
]

export default function Checkout() {
  const navigate = useNavigate()
  const { subtotal } = useSelector((s) => s.cart)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')
  const [couponCode, setCouponCode] = useState('')
  const [placing, setPlacing] = useState(false)
  const [newAddress, setNewAddress] = useState({
    fullName: '', phone: '', line1: '', line2: '', city: '', state: '', postalCode: '', country: 'USA'
  })
  const [showNewAddress, setShowNewAddress] = useState(false)

  useEffect(() => {
    axiosClient.get('/addresses').then(({ data }) => {
      setAddresses(data)
      if (data.length) setSelectedAddress(data[0].id)
      else setShowNewAddress(true)
    })
  }, [])

  const handleAddAddress = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axiosClient.post('/addresses', { ...newAddress, isDefault: addresses.length === 0 })
      setAddresses([...addresses, data])
      setSelectedAddress(data.id)
      setShowNewAddress(false)
      toast.success('Address saved')
    } catch {
      toast.error('Could not save address')
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a shipping address')
      return
    }
    setPlacing(true)
    try {
      const { data } = await axiosClient.post('/orders/checkout', {
        shippingAddressId: selectedAddress,
        billingAddressId: selectedAddress,
        couponCode: couponCode || undefined,
        paymentMethod
      })
      toast.success('Order placed!')
      navigate(`/order-success/${data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <section className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Shipping Address</h2>
        <div className="space-y-2">
          {addresses.map((a) => (
            <label key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${selectedAddress === a.id ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700'}`}>
              <input type="radio" checked={selectedAddress === a.id} onChange={() => setSelectedAddress(a.id)} className="mt-1" />
              <div className="text-sm">
                <p className="font-medium">{a.fullName} · {a.phone}</p>
                <p className="text-gray-500">{a.line1}, {a.city}, {a.state} {a.postalCode}, {a.country}</p>
              </div>
            </label>
          ))}
        </div>
        <button onClick={() => setShowNewAddress(!showNewAddress)} className="text-primary-600 text-sm font-medium mt-3 hover:underline">
          + Add new address
        </button>

        {showNewAddress && (
          <form onSubmit={handleAddAddress} className="mt-4 grid grid-cols-2 gap-3">
            <input required placeholder="Full name" className="input-field col-span-2" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
            <input required placeholder="Phone" className="input-field col-span-2" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} />
            <input required placeholder="Address line 1" className="input-field col-span-2" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
            <input placeholder="Address line 2" className="input-field col-span-2" value={newAddress.line2} onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
            <input required placeholder="City" className="input-field" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
            <input required placeholder="State" className="input-field" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
            <input required placeholder="Postal code" className="input-field" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
            <input required placeholder="Country" className="input-field" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
            <button type="submit" className="btn-primary col-span-2">Save Address</button>
          </form>
        )}
      </section>

      <section className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Payment Method</h2>
        <div className="grid grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((m) => (
            <label key={m.value} className={`p-3 rounded-xl border cursor-pointer text-sm text-center ${paymentMethod === m.value ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 font-semibold' : 'border-gray-200 dark:border-gray-700'}`}>
              <input type="radio" className="hidden" checked={paymentMethod === m.value} onChange={() => setPaymentMethod(m.value)} />
              {m.label}
            </label>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">This is a mock payment flow — no real transaction occurs.</p>
      </section>

      <section className="card p-6 mb-6">
        <h2 className="font-semibold mb-3">Coupon Code</h2>
        <div className="flex gap-2">
          <input placeholder="e.g. WELCOME10" className="input-field" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
        </div>
      </section>

      <div className="card p-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">Subtotal</p>
          <p className="text-xl font-bold">${subtotal.toFixed(2)}</p>
        </div>
        <button onClick={handlePlaceOrder} disabled={placing} className="btn-primary px-8">
          {placing ? 'Placing order...' : 'Place Order'}
        </button>
      </div>
    </div>
  )
}
