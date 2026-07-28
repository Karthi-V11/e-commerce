import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Heart, ShoppingCart, Bell, User, Moon, Sun, Menu } from 'lucide-react'
import { toggleDarkMode } from '../../app/uiSlice'
import { logout } from '../../features/auth/authSlice'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const { totalItems } = useSelector((s) => s.cart)
  const { darkMode } = useSelector((s) => s.ui)
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/products?keyword=${encodeURIComponent(query)}`)
  }

  return (
    <header className="sticky top-0 z-40 glass shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
              ShopSphere
            </span>
          </Link>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
            <div className="relative w-full">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products, brands and more..."
                className="input-field pr-11"
              />
              <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-500 hover:text-primary-600">
                <Search size={18} />
              </button>
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-1">
            <button onClick={() => dispatch(toggleDarkMode())} className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Toggle dark mode">
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link to="/wishlist" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Wishlist">
              <Heart size={20} />
            </Link>
            <Link to="/notifications" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Notifications">
              <Bell size={20} />
            </Link>
            <Link to="/cart" className="relative rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800" aria-label="Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[11px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <Link to="/profile" className="flex items-center gap-2 rounded-full px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800">
                <User size={20} />
                <span className="text-sm font-medium">{user.firstName}</span>
              </Link>
            ) : (
              <Link to="/login" className="btn-primary text-sm px-4 py-2">Sign In</Link>
            )}
            {user && (
              <button
                onClick={() => { dispatch(logout()); navigate('/') }}
                className="text-sm font-medium text-gray-500 hover:text-red-600 px-2"
              >
                Logout
              </button>
            )}
          </div>

          <button className="lg:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={22} />
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden pb-4 flex flex-col gap-2">
            <form onSubmit={handleSearch}>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="input-field"
              />
            </form>
            <div className="flex justify-around pt-2">
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}><Heart size={20} /></Link>
              <Link to="/cart" onClick={() => setMenuOpen(false)}><ShoppingCart size={20} /></Link>
              <Link to="/notifications" onClick={() => setMenuOpen(false)}><Bell size={20} /></Link>
              <Link to={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}><User size={20} /></Link>
              <button onClick={() => dispatch(toggleDarkMode())}>{darkMode ? <Sun size={20} /> : <Moon size={20} />}</button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
