import { useState } from 'react'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const RecipeEditorPage = () => {
  const { token } = useAuth()
  const [step, setStep] = useState(1)
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    category: 'dinner',
    difficulty: 'easy',
    tags: [],
    ingredients: [{ name: '', quantity: 1, unit: '' }],
    instructions: [''],
    prepTime: 0,
    cookTime: 0,
    servings: 1,
    isPublished: false,
  })

  const saveRecipe = async (publish) => {
    try {
      await api.post('/recipes', { ...recipe, isPublished: publish }, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(publish ? 'Recipe published' : 'Recipe saved as draft')
    } catch {
      toast.error('Could not save recipe')
    }
  }

  return (
    <div className="card p-6 space-y-4">
      <p className="text-sm text-secondary">Step {step} of 5</p>
      <progress value={step} max="5" className="w-full" />
      <input className="input-base" placeholder="Recipe title" value={recipe.title} onChange={(e) => setRecipe({ ...recipe, title: e.target.value })} />
      <textarea className="input-base" placeholder="Description" value={recipe.description} onChange={(e) => setRecipe({ ...recipe, description: e.target.value })} />
      <div className="flex gap-3">
        <button className="btn-primary" onClick={() => setStep((s) => Math.min(5, s + 1))}>Next Step</button>
        <button className="btn-primary" onClick={() => saveRecipe(false)}>Save Draft</button>
        <button className="btn-primary" onClick={() => saveRecipe(true)}>Publish</button>
      </div>
    </div>
  )
}

export default RecipeEditorPage
