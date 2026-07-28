import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-semibold mb-3">Get to Know Us</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/about">About ShopSphere</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press Releases</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Connect</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Make Money With Us</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/seller/onboard">Sell on ShopSphere</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Let Us Help You</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link to="/orders">Your Orders</Link></li>
            <li><Link to="/returns">Returns & Replacements</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ShopSphere. Portfolio project — not affiliated with any real retailer.
      </div>
    </footer>
  )
}
