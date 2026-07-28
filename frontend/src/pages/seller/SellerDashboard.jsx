import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import axiosClient from '../../api/axiosClient'

const emptyForm = { name: '', categoryId: '', brand: '', description: '', price: '', discountPrice: '', stockQuantity: '', imageUrls: [] }

export default function SellerDashboard() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const loadProducts = () => axiosClient.get('/seller/products').then(({ data }) => setProducts(data.content))

  useEffect(() => {
    loadProducts()
    axiosClient.get('/categories').then(({ data }) => setCategories(data))
  }, [])

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      categoryId: Number(form.categoryId),
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stockQuantity: Number(form.stockQuantity),
      imageUrls: form.imageUrls.filter(Boolean)
    }
    try {
      if (editingId) {
        await axiosClient.put(`/seller/products/${editingId}`, payload)
        toast.success('Product updated')
      } else {
        await axiosClient.post('/seller/products', payload)
        toast.success('Product created')
      }
      resetForm()
      loadProducts()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed')
    }
  }

  const handleEdit = (p) => {
    setForm({
      name: p.name, categoryId: p.categoryId, brand: p.brand || '', description: p.description || '',
      price: p.price, discountPrice: p.discountPrice || '', stockQuantity: p.stockQuantity,
      imageUrls: p.images?.map((i) => i.imageUrl) || []
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Deactivate this product?')) return
    await axiosClient.delete(`/seller/products/${id}`)
    toast.success('Product deactivated')
    loadProducts()
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <div className="card p-5"><p className="text-sm text-gray-500">Total Products</p><p className="text-2xl font-bold">{products.length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">In Stock</p><p className="text-2xl font-bold">{products.filter(p => p.stockQuantity > 0).length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Out of Stock</p><p className="text-2xl font-bold">{products.filter(p => p.stockQuantity === 0).length}</p></div>
        <div className="card p-5"><p className="text-sm text-gray-500">Avg Rating</p><p className="text-2xl font-bold">{(products.reduce((a, p) => a + Number(p.averageRating || 0), 0) / (products.length || 1)).toFixed(1)}</p></div>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 grid grid-cols-2 gap-4">
          <input required placeholder="Product name" className="input-field col-span-2" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <select required className="input-field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input placeholder="Brand" className="input-field" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
          <input required type="number" step="0.01" placeholder="Price" className="input-field" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input type="number" step="0.01" placeholder="Discount price (optional)" className="input-field" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
          <input required type="number" placeholder="Stock quantity" className="input-field" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} />
          <input placeholder="Image URL" className="input-field" value={form.imageUrls[0] || ''} onChange={(e) => setForm({ ...form, imageUrls: [e.target.value] })} />
          <textarea placeholder="Description" rows={3} className="input-field col-span-2" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <div className="col-span-2 flex gap-3">
            <button type="submit" className="btn-primary">{editingId ? 'Update Product' : 'Create Product'}</button>
            <button type="button" onClick={resetForm} className="btn-secondary">Cancel</button>
          </div>
        </form>
      )}

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left text-gray-500">
            <tr>
              <th className="p-4">Product</th><th className="p-4">Price</th><th className="p-4">Stock</th><th className="p-4">Rating</th><th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="p-4 font-medium">{p.name}</td>
                <td className="p-4">${p.price.toFixed(2)}</td>
                <td className="p-4">{p.stockQuantity}</td>
                <td className="p-4">{Number(p.averageRating).toFixed(1)} ({p.reviewCount})</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => handleEdit(p)} className="text-primary-600"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && <p className="p-6 text-center text-gray-500">No products yet. Add your first one above.</p>}
      </div>
    </div>
  )
}
