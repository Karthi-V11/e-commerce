import React from 'react'

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
      <div className="p-4 space-y-2">
        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-800" />
        <div className="h-4 w-1/2 rounded bg-gray-200 dark:bg-gray-800" />
      </div>
    </div>
  )
}
