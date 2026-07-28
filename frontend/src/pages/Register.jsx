import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { register } from '../features/auth/authSlice'

export default function Register() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', phone: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(register(form))
    if (register.fulfilled.match(result)) {
      toast.success('Account created!')
      navigate('/')
    } else {
      toast.error(result.payload || 'Registration failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-sm text-gray-500 mb-6">Join ShopSphere in seconds</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" className="input-field" value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            <input required placeholder="Last name" className="input-field" value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <input required type="email" placeholder="Email" className="input-field" value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Phone (optional)" className="input-field" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <input required type="password" minLength={8} placeholder="Password (min 8 characters)" className="input-field" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
