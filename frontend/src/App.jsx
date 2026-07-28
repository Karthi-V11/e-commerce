import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import ProtectedRoute from './components/common/ProtectedRoute'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Orders from './pages/Orders'
import Profile from './pages/Profile'
import SellerDashboard from './pages/seller/SellerDashboard'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFound from './pages/NotFound'

export default function App() {
  const { darkMode } = useSelector((s) => s.ui)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />

          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/order-success/:id" element={
            <ProtectedRoute><OrderSuccess /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><Orders /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><Profile /></ProtectedRoute>
          } />
          <Route path="/seller/dashboard" element={
            <ProtectedRoute roles={['ROLE_SELLER', 'ROLE_ADMIN']}><SellerDashboard /></ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute roles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
