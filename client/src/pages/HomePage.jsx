import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import { IMAGES, getRecipeImage, onImageErrorToFallback } from '../utils/images.js'

const HomePage = () => {
  const { user, token } = useAuth()
  const navigate = useNavigate()
  const [featured, setFeatured] = useState([])
  const [featuredChefs, setFeaturedChefs] = useState([])
  const [savedRecipes, setSavedRecipes] = useState([])
  const [chefOverview, setChefOverview] = useState({ summary: { views: 0, likes: 0 }, recipes: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin')
    ;(async () => {
      const [recipesRes, chefsRes] = await Promise.all([
        api.get('/recipes', { params: { limit: 8 } }),
        api.get('/chefs'),
      ])
      setFeatured(recipesRes.data.recipes || [])
      setFeaturedChefs(chefsRes.data || [])
      if (user?.role === 'user' && token) {
        const { data } = await api.get('/users/saved', { headers: { Authorization: `Bearer ${token}` } })
        setSavedRecipes(data || [])
      }
      if (user?.role === 'chef' && token) {
        const { data } = await api.get('/analytics/chef', { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: { summary: { views: 0, likes: 0 }, recipes: [] } }))
        setChefOverview(data)
      }
      setLoading(false)
    })()
  }, [navigate, user, token])

  const recentViewedIds = useMemo(() => {
    const stored = localStorage.getItem('recent_recipe_views')
    return stored ? JSON.parse(stored) : []
  }, [])
  const recentViewed = featured.filter((recipe) => recentViewedIds.includes(recipe._id)).slice(0, 6)

  return (
    <div className="space-y-10">
      {!user && (
        <section className="rounded-2xl border border-border bg-white p-8 md:p-12 relative overflow-hidden min-h-[320px]">
          <img src={IMAGES.hero} alt="Cooking ingredients on kitchen table" loading="eager" onError={onImageErrorToFallback} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="grid lg:grid-cols-2 gap-10 relative z-10">
            <div>
              <h1 className="text-5xl font-bold leading-tight tracking-tight text-white">Discover Recipes<br />From Real Chefs</h1>
              <p className="mt-4 text-gray-100 max-w-xl">Find trusted recipes from culinary professionals and save your personal collection.</p>
              <div className="mt-6 flex gap-3">
                <Link to="/recipes" className="btn-primary">Explore Recipes</Link>
                <Link to="/chefs" className="rounded-lg border border-white px-4 py-2 text-white hover:bg-white/10">Meet Our Chefs</Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {featured.slice(0, 4).map((recipe, index) => (
                <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card p-3" style={{ transform: `rotate(${index % 2 === 0 ? '-2deg' : '2deg'})` }}>
                  <img src={getRecipeImage(recipe)} alt={`${recipe.title} recipe`} loading="lazy" onError={onImageErrorToFallback} className="h-24 w-full rounded object-cover" />
                  <p className="text-sm font-semibold mt-2 line-clamp-2">{recipe.title}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {!user && <section className="rounded-lg bg-[#111827] text-white py-4 px-6 flex flex-wrap gap-6 text-sm"><span>2,400+ Recipes</span><span>180 Expert Chefs</span><span>50,000+ Cooks</span></section>}
      {user?.role === 'chef' && (
        <section className="card p-6">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="card p-4">My Recipes: <strong>{chefOverview.recipes?.length || 0}</strong></div>
            <div className="card p-4">Total Views: <strong>{chefOverview.summary?.views || 0}</strong></div>
            <div className="card p-4">Total Likes: <strong>{chefOverview.summary?.likes || 0}</strong></div>
          </div>
          <div className="mt-4 flex gap-3">
            <Link to="/chef/recipes/new" className="btn-primary">Add New Recipe</Link>
            <Link to="/chef/analytics" className="btn-secondary">View Analytics</Link>
            <Link to="/chef/profile" className="btn-secondary">Edit Profile</Link>
          </div>
        </section>
      )}
      {user?.role === 'user' && (
        <section className="card p-6 space-y-4">
          <h1 className="text-3xl font-bold">Welcome back, {user.name}</h1>
          <div>
            <h2 className="text-lg font-semibold mb-2">Continue Browsing</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {recentViewed.map((recipe) => (
                <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card p-3">{recipe.title}</Link>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Saved Recipes</h2>
            <div className="grid md:grid-cols-4 gap-3">{savedRecipes.slice(0, 4).map((recipe) => <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card p-3">{recipe.title}</Link>)}</div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="section-title">Featured Recipes</h2>
          <Link className="text-primary font-semibold hover:underline" to="/recipes">View All Recipes →</Link>
        </div>
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, i) => <div key={i} className="skeleton h-48" />)}</div>
        ) : featured.length === 0 ? (
          <div className="empty-state">
            <img src={IMAGES.fallback} alt="No recipes yet" loading="lazy" onError={onImageErrorToFallback} className="h-20 w-20 rounded-full object-cover mx-auto mb-2" />
            <p className="font-semibold text-dark">No recipes yet</p>
            <p>Chefs will add fresh recipes soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((recipe) => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card overflow-hidden interactive">
                <img src={getRecipeImage(recipe)} alt={`${recipe.title} recipe`} loading="lazy" onError={onImageErrorToFallback} className="h-[200px] w-full object-cover" />
                <div className="p-4 space-y-2">
                  <p className="font-bold">{recipe.title}</p>
                  <p className="text-sm text-secondary">By {recipe.chef?.name || 'Unknown chef'}</p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-1">{recipe.cookTime || 0} min</span>
                    <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-1">{recipe.difficulty}</span>
                    <span className="text-secondary">Likes: {recipe.likes?.length || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="section-title">Featured Chefs</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {featuredChefs.map((chef) => (
            <Link key={chef._id} to={`/chefs/${chef._id}`} className="card min-w-[320px] p-4">
              <p className="font-semibold">{chef.name}</p>
              <p className="text-sm text-muted">{chef.speciality || 'General Cuisine'}</p>
              <p className="text-xs text-muted mt-2">{chef.recipeCount || 0} recipes</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="section-title">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {['Browse recipes', 'Create an account', 'Save your favourites'].map((item, index) => (
            <div key={item} className="card p-6">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white">{index + 1}</span>
              <p className="font-semibold mt-3">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage
