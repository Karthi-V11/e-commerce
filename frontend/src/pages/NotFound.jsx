import React from 'react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-6 py-32 text-center">
      <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
      <p className="mt-4 text-gray-500">Page not found.</p>
      <Link to="/" className="btn-primary inline-flex mt-6">Back to Home</Link>
    </div>
  )
}
