import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { User, MapPin, Package, Heart, Shield, Bell } from 'lucide-react'
import axiosClient from '../api/axiosClient'

const TABS = [
  { key: 'info', label: 'Personal Info', icon: User },
  { key: 'addresses', label: 'Addresses', icon: MapPin },
  { key: 'orders', label: 'Orders', icon: Package },
  { key: 'wishlist', label: 'Wishlist', icon: Heart },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'notifications', label: 'Notifications', icon: Bell }
]

export default function Profile() {
  const { user } = useSelector((s) => s.auth)
  const [tab, setTab] = useState('info')
  const [addresses, setAddresses] = useState([])

  useEffect(() => {
    if (tab === 'addresses') {
      axiosClient.get('/addresses').then(({ data }) => setAddresses(data))
    }
  }, [tab])

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 grid md:grid-cols-4 gap-8">
      <aside className="md:col-span-1">
        <div className="card p-4 text-center mb-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-300 font-bold text-xl">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <p className="font-semibold mt-2">{user?.firstName} {user?.lastName}</p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
        <nav className="card p-2">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${tab === key ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="md:col-span-3">
        {tab === 'info' && (
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Personal Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-xs text-gray-500">First Name</label><p className="font-medium">{user?.firstName}</p></div>
              <div><label className="text-xs text-gray-500">Last Name</label><p className="font-medium">{user?.lastName}</p></div>
              <div><label className="text-xs text-gray-500">Email</label><p className="font-medium">{user?.email}</p></div>
              <div><label className="text-xs text-gray-500">Phone</label><p className="font-medium">{user?.phone || '—'}</p></div>
              <div><label className="text-xs text-gray-500">Roles</label><p className="font-medium">{user?.roles?.join(', ')}</p></div>
            </div>
          </div>
        )}

        {tab === 'addresses' && (
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Saved Addresses</h2>
            {addresses.length === 0 && <p className="text-gray-500 text-sm">No addresses saved yet — add one at checkout.</p>}
            <div className="space-y-3">
              {addresses.map((a) => (
                <div key={a.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-3 text-sm">
                  <p className="font-medium">{a.fullName} {a.isDefault && <span className="text-xs text-primary-600">(Default)</span>}</p>
                  <p className="text-gray-500">{a.line1}, {a.city}, {a.state} {a.postalCode}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'orders' && (
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-2">Order History</h2>
            <p className="text-sm text-gray-500">See your full order history on the <a href="/orders" className="text-primary-600 hover:underline">Orders page</a>.</p>
          </div>
        )}

        {tab === 'wishlist' && (
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-2">Wishlist</h2>
            <p className="text-sm text-gray-500">Wishlist backend endpoints aren't wired up in this scaffold yet — the `wishlist`/`wishlist_items` tables exist and are ready for a service+controller pass.</p>
          </div>
        )}

        {tab === 'security' && (
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-4">Security</h2>
            <button className="btn-secondary">Change Password</button>
          </div>
        )}

        {tab === 'notifications' && (
          <div className="card p-6">
            <h2 className="font-bold text-lg mb-2">Notifications</h2>
            <p className="text-sm text-gray-500">Notification endpoints aren't wired up yet — same status as wishlist above.</p>
          </div>
        )}
      </main>
    </div>
  )
}
