import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'

const AdminRecipesPage = () => {
  const { token } = useAuth()
  const [recipes, setRecipes] = useState([])
  const [filters, setFilters] = useState({ search: '', status: 'all', category: 'all' })

  const load = async () => {
    const { data } = await api.get('/admin/recipes', { headers: { Authorization: `Bearer ${token}` }, params: filters })
    setRecipes(data || [])
  }

  useEffect(() => { load() }, [token, filters.search, filters.status, filters.category])

  const remove = async (id) => {
    if (!window.confirm('Delete recipe?')) return
    await api.delete(`/admin/recipes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Recipe deleted')
    load()
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <AdminSidebar />
      <div className="card p-6 overflow-x-auto space-y-3">
        <h1 className="text-2xl font-bold">All Recipes</h1>
        <div className="grid md:grid-cols-3 gap-2">
          <input className="input-base" placeholder="Search title" onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))} />
          <select className="input-base" onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}><option value="all">All</option><option value="published">Published</option><option value="draft">Draft</option></select>
          <select className="input-base" onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}><option value="all">All Categories</option><option value="breakfast">Breakfast</option><option value="lunch">Lunch</option><option value="dinner">Dinner</option><option value="dessert">Dessert</option><option value="snack">Snack</option><option value="beverage">Beverage</option></select>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="p-2 text-left">Title</th><th className="p-2 text-left">Chef</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Views</th><th className="p-2 text-left">Likes</th><th className="p-2 text-left">Created</th><th className="p-2 text-left">Actions</th></tr></thead>
          <tbody>{recipes.map((recipe) => <tr key={recipe._id} className="odd:bg-[#FAFAFA] hover:bg-[#FFF3EE]"><td className="p-2">{recipe.title}</td><td className="p-2">{recipe.chef?.name || '-'}</td><td className="p-2 capitalize">{recipe.category}</td><td className="p-2">{recipe.isPublished ? 'Published' : 'Draft'}</td><td className="p-2">{recipe.views || 0}</td><td className="p-2">{recipe.likes?.length || 0}</td><td className="p-2">{new Date(recipe.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td><td className="p-2 space-x-2"><Link to={`/recipes/${recipe._id}`}>View</Link><button type="button" onClick={() => remove(recipe._id)}>Delete</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminRecipesPage
