import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { login } from '../features/auth/authSlice'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { status, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(login(form))
    if (login.fulfilled.match(result)) {
      toast.success('Welcome back!')
      navigate('/')
    } else {
      toast.error(result.payload || 'Login failed')
    }
  }

  return (
    <div className="mx-auto max-w-md px-6 py-16">
      <div className="card p-8">
        <h1 className="text-2xl font-bold mb-1">Sign in</h1>
        <p className="text-sm text-gray-500 mb-6">Welcome back to ShopSphere</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <input required type="email" className="input-field mt-1" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium">Password</label>
            <input required type="password" className="input-field mt-1" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={form.rememberMe}
                onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })} />
              Remember me
            </label>
            <Link to="/forgot-password" className="text-primary-600 hover:underline">Forgot password?</Link>
          </div>
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-full">
            {status === 'loading' ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          New to ShopSphere? <Link to="/register" className="text-primary-600 font-medium hover:underline">Create an account</Link>
        </p>
        <div className="mt-6 rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-xs text-gray-500">
          Demo accounts (seed data): <br />
          customer@shopsphere.com / Password123! <br />
          seller@shopsphere.com / Password123! <br />
          admin@shopsphere.com / Password123!
        </div>
      </div>
    </div>
  )
}
