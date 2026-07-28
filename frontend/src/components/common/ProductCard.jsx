import React from 'react'
import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

export default function ProductCard({ product }) {
  const image = product.images?.[0]?.imageUrl || 'https://placehold.co/400x400?text=ShopSphere'
  const hasDiscount = product.discountPrice && product.discountPrice < product.price

  return (
    <Link to={`/products/${product.slug}`} className="card group block overflow-hidden">
      <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        {product.brand && <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{product.brand}</p>}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-800 dark:text-gray-100">{product.name}</h3>
        <div className="mt-2 flex items-center gap-1">
          <Star size={14} className="fill-accent-500 text-accent-500" />
          <span className="text-xs text-gray-500">{Number(product.averageRating || 0).toFixed(1)} ({product.reviewCount || 0})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ${(hasDiscount ? product.discountPrice : product.price)?.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
