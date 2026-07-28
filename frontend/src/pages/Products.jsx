import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../features/products/productSlice'
import ProductCard from '../components/common/ProductCard'
import { ProductCardSkeleton } from '../components/common/Skeleton'

export default function Products() {
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const { content, status, page, totalPages } = useSelector((s) => s.products)
  const [sortBy, setSortBy] = useState('createdAt')
  const [direction, setDirection] = useState('desc')

  const keyword = searchParams.get('keyword') || ''

  useEffect(() => {
    dispatch(fetchProducts({ keyword, page: 0, size: 12, sortBy, direction }))
  }, [dispatch, keyword, sortBy, direction])

  const loadMore = () => {
    dispatch(fetchProducts({ keyword, page: page + 1, size: 12, sortBy, direction }))
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">{keyword ? `Results for "${keyword}"` : 'All Products'}</h1>
        <select
          value={`${sortBy}-${direction}`}
          onChange={(e) => {
            const [sb, dir] = e.target.value.split('-')
            setSortBy(sb); setDirection(dir)
          }}
          className="input-field w-auto"
        >
          <option value="createdAt-desc">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="averageRating-desc">Top Rated</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {status === 'loading' && page === 0
          ? Array.from({ length: 12 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : content.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      {content.length === 0 && status !== 'loading' && (
        <p className="text-center text-gray-500 py-20">No products found.</p>
      )}

      {page + 1 < totalPages && (
        <div className="text-center mt-10">
          <button onClick={loadMore} className="btn-secondary">Load more</button>
        </div>
      )}
    </div>
  )
}
