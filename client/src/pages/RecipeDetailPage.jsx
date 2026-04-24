import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get(`/recipes/${id}`)
      setRecipe(data)
    })()
  }, [id])

  if (!recipe) return <div className="card p-6">Loading...</div>
  return (
    <article className="card p-6 space-y-4">
      <img
        src={recipe.images?.[0] || 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80'}
        alt={recipe.title}
        className="w-full h-72 object-cover rounded-xl"
      />
      <h1 className="text-3xl font-bold">{recipe.title}</h1>
      <p className="text-sm text-secondary">By {recipe.chef?.name || 'Chef Demo'}</p>
      <p className="text-secondary">{recipe.description}</p>
      <div>
        <h2 className="font-semibold">Ingredients</h2>
        <ul className="list-disc pl-5">{recipe.ingredients?.map((i, idx) => <li key={idx}>{i.quantity} {i.unit} {i.name}</li>)}</ul>
      </div>
    </article>
  )
}

export default RecipeDetailPage
