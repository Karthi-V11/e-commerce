import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import axiosClient from '../api/axiosClient'
import { addToCart } from '../features/cart/cartSlice'

export default function ProductDetail() {
  const { slug } = useParams()
  const dispatch = useDispatch()
  const [product, setProduct] = useState(null)
  const [activeImage, setActiveImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    axiosClient.get(`/products/${slug}`)
      .then(({ data }) => {
        setProduct(data)
        return axiosClient.get(`/products/${data.id}/reviews`)
      })
      .then(({ data }) => setReviews(data.content))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap()
      toast.success('Added to cart')
    } catch {
      toast.error('Could not add to cart')
    }
  }

  if (loading) return <div className="mx-auto max-w-7xl px-6 py-20 text-center text-gray-500">Loading...</div>
  if (!product) return null

  const hasDiscount = product.discountPrice && product.discountPrice < product.price
  const images = product.images?.length ? product.images : [{ imageUrl: 'https://placehold.co/600x600' }]

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="card overflow-hidden aspect-square">
            <img src={images[activeImage].imageUrl} alt={product.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex gap-2 mt-3">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImage(i)}
                className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${i === activeImage ? 'border-primary-600' : 'border-transparent'}`}>
                <img src={img.imageUrl} className="h-full w-full object-cover" alt="" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          {product.brand && <p className="text-sm text-gray-400 uppercase font-medium">{product.brand}</p>}
          <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Star size={16} className="fill-accent-500 text-accent-500" />
            <span className="text-sm text-gray-600">{Number(product.averageRating).toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-extrabold">${(hasDiscount ? product.discountPrice : product.price).toFixed(2)}</span>
            {hasDiscount && <span className="text-lg text-gray-400 line-through">${product.price.toFixed(2)}</span>}
          </div>

          <p className={`mt-2 text-sm font-medium ${product.stockQuantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} available)` : 'Out of Stock'}
          </p>

          <p className="mt-4 text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <input
              type="number" min={1} max={product.stockQuantity} value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="input-field w-20"
            />
            <button onClick={handleAddToCart} disabled={product.stockQuantity === 0} className="btn-primary flex-1">
              <ShoppingCart size={18} /> Add to Cart
            </button>
            <button className="btn-secondary"><Heart size={18} /></button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16">
        <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 && <p className="text-gray-500 text-sm">No reviews yet — be the first to review this product.</p>}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold">{r.userFirstName}</span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={14} className={i < r.rating ? 'fill-accent-500 text-accent-500' : 'text-gray-300'} />
                  ))}
                </div>
              </div>
              {r.title && <p className="font-medium mt-1">{r.title}</p>}
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{r.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
