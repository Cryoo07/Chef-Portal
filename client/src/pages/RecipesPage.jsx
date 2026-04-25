import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { IMAGES, getRecipeImage, onImageErrorToFallback } from '../utils/images.js'

const categories = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack', 'beverage']
const RecipesPage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('all')

  useEffect(() => {
    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await api.get('/recipes', { params: { search, ...(category !== 'all' ? { category } : {}) } })
      setRecipes(data.recipes || [])
      setLoading(false)
    }, 350)
    return () => clearTimeout(timer)
  }, [search, category])

  return (
    <div className="space-y-6">
      <section className="rounded-3xl p-8 text-white flex flex-wrap items-center justify-between gap-3 relative overflow-hidden min-h-[190px]">
        <img src={IMAGES.recipesBanner} alt="Recipe page banner" loading="eager" onError={onImageErrorToFallback} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <h1 className="text-4xl font-extrabold relative z-10">Explore Recipes</h1>
        <span className="rounded-full bg-white/20 px-4 py-2 text-sm relative z-10">{recipes.length} recipes</span>
      </section>

      <div className="card p-4 space-y-3">
        <input className="input-base" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`px-3 py-1 rounded-full border text-sm ${category === item ? 'bg-primary border-primary text-white' : 'bg-white border-primary text-primary'}`}
            >
              {item[0].toUpperCase() + item.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{[...Array(6)].map((_, idx) => <div key={idx} className="skeleton h-52" />)}</div>
      ) : recipes.length === 0 ? (
          <div className="empty-state">
            <img src={IMAGES.fallback} alt="No recipes available" loading="lazy" onError={onImageErrorToFallback} className="h-24 w-24 rounded-full object-cover mx-auto mb-2" />
          <p className="font-semibold text-dark">No recipes match your filters</p>
          <p>Try a different search or category.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card p-0 overflow-hidden interactive">
              <img src={getRecipeImage(recipe)} alt={`${recipe.title} recipe`} loading="lazy" onError={onImageErrorToFallback} className="h-[200px] w-full object-cover" />
              <div className="p-4 space-y-2">
                <p className="font-bold">{recipe.title}</p>
                <p className="text-sm text-secondary">By {recipe.chef?.name || 'Unknown chef'}</p>
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-1">{recipe.cookTime || 0} min</span>
                  <span className="rounded-full bg-orange-100 text-orange-700 px-2 py-1 capitalize">{recipe.difficulty}</span>
                  <span className="text-secondary">Likes: {recipe.likes?.length || 0}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipesPage
