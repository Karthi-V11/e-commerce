import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '../features/products/productSlice'
import ProductCard from '../components/common/ProductCard'
import { ProductCardSkeleton } from '../components/common/Skeleton'

const CATEGORIES = [
  { name: 'Electronics', slug: 'electronics', img: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400' },
  { name: 'Fashion', slug: 'fashion', img: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', img: 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=400' },
  { name: 'Books', slug: 'books', img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400' }
]

export default function Landing() {
  const dispatch = useDispatch()
  const { content, status } = useSelector((s) => s.products)

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 8, sortBy: 'createdAt', direction: 'desc' }))
  }, [dispatch])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-accent-500 text-white">
        <div className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Everything you need,<br /> delivered with delight.
            </h1>
            <p className="mt-4 text-lg text-white/90">
              Discover curated deals across electronics, fashion, home and more — all in one premium marketplace.
            </p>
            <Link to="/products" className="mt-8 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-primary-700 shadow-lg hover:bg-gray-100 transition">
              Shop Now
            </Link>
          </div>
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
              alt="Shopping"
              className="rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h2 className="text-2xl font-bold mb-6">Featured Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to={`/products?categorySlug=${c.slug}`} className="card overflow-hidden group">
              <div className="aspect-video overflow-hidden">
                <img src={c.img} alt={c.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3 text-center font-semibold">{c.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending products */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Trending Products</h2>
          <Link to="/products" className="text-primary-600 font-medium hover:underline">View all →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {status === 'loading'
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : content.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-900 text-white">
        <div className="mx-auto max-w-4xl px-6 py-16 text-center">
          <h2 className="text-2xl font-bold">Stay in the loop</h2>
          <p className="mt-2 text-gray-300">Get early access to flash sales and new arrivals.</p>
          <form className="mt-6 flex max-w-md mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@example.com" className="input-field flex-1 text-gray-900" />
            <button className="btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
  )
}
