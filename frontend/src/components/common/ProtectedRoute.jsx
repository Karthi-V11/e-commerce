import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function ProtectedRoute({ children, roles }) {
  const { user, accessToken } = useSelector((s) => s.auth)

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.some((r) => user.roles?.includes(r))) {
    return <Navigate to="/" replace />
  }
  return children
}
