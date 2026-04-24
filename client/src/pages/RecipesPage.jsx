import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(async () => {
      const { data } = await api.get('/recipes', { params: { search } })
      setRecipes(data.recipes || [])
    }, 350)
    return () => clearTimeout(timer)
  }, [search])

  return (
    <div className="space-y-4">
      <input className="input-base" placeholder="Search recipes..." value={search} onChange={(e) => setSearch(e.target.value)} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <Link key={recipe._id} to={`/recipes/${recipe._id}`} className="card p-0 overflow-hidden">
            <img
              src={recipe.images?.[0] || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80'}
              alt={recipe.title}
              className="h-44 w-full object-cover"
              loading="lazy"
            />
            <div className="p-4 space-y-2">
              <p className="font-bold">{recipe.title}</p>
              <p className="text-sm text-secondary">By {recipe.chef?.name || 'Chef Demo'}</p>
              <p className="text-sm text-secondary">{recipe.category} • {recipe.difficulty}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default RecipesPage
