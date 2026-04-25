import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import ChefSidebar from '../components/ChefSidebar.jsx'

const ChefRecipesPage = () => {
  const { token, user } = useAuth()
  const [recipes, setRecipes] = useState([])

  const load = async () => {
    const { data } = await api.get('/recipes/mine/list', { headers: { Authorization: `Bearer ${token}` } })
    setRecipes(data || [])
  }

  useEffect(() => {
    load()
  }, [token])

  const onDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return
    await api.delete(`/recipes/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Recipe deleted')
    load()
  }

  const onTogglePublish = async (recipe) => {
    await api.put(`/recipes/${recipe._id}`, { isPublished: !recipe.isPublished }, { headers: { Authorization: `Bearer ${token}` } })
    toast.success(recipe.isPublished ? 'Recipe moved to draft' : 'Recipe published')
    load()
  }

  if (!user?.isApproved) {
    return (
      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <ChefSidebar />
        <div className="empty-state"><p className="font-semibold text-dark">Pending approval</p><p>You cannot post recipes until admin approves your chef account.</p></div>
      </div>
    )
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <ChefSidebar />
      <div className="card p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">My Recipes</h1>
        {recipes.length === 0 ? (
          <div className="empty-state"><p className="font-semibold text-dark">You haven't posted any recipes yet.</p><p>Click Add Recipe to get started.</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Cover</th><th className="p-2 text-left">Title</th><th className="p-2 text-left">Category</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Views</th><th className="p-2 text-left">Likes</th><th className="p-2 text-left">Saves</th><th className="p-2 text-left">Date Created</th><th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recipes.map((recipe) => (
                <tr key={recipe._id} className="odd:bg-[#FAFAFA] hover:bg-[#FFF3EE]">
                  <td className="p-2">{recipe.images?.[0] ? <img src={recipe.images[0]} alt={recipe.title} className="h-12 w-16 object-cover rounded" /> : <div className="h-12 w-16 rounded" style={{ background: 'linear-gradient(135deg, #FFF3EE, #FF6B35)' }} />}</td>
                  <td className="p-2"><Link className="text-primary" to={`/recipes/${recipe._id}`}>{recipe.title}</Link></td>
                  <td className="p-2 capitalize">{recipe.category}</td>
                  <td className="p-2"><span className={`px-2 py-1 text-xs rounded ${recipe.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{recipe.isPublished ? 'Published' : 'Draft'}</span></td>
                  <td className="p-2">{recipe.views || 0}</td>
                  <td className="p-2">{recipe.likes?.length || 0}</td>
                  <td className="p-2">{recipe.savedBy?.length || 0}</td>
                  <td className="p-2">{new Date(recipe.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                  <td className="p-2 space-x-2">
                    <Link className="text-primary" to={`/chef/recipes/${recipe._id}/edit`}>Edit</Link>
                    <button type="button" onClick={() => onDelete(recipe._id)}>Delete</button>
                    <button type="button" onClick={() => onTogglePublish(recipe)}>{recipe.isPublished ? 'Unpublish' : 'Publish'}</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

export default ChefRecipesPage
