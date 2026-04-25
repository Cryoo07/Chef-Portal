import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import ChefSidebar from '../components/ChefSidebar.jsx'

const RecipeEditorPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { token, user } = useAuth()
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
    prepUnit: 'minutes',
    cookUnit: 'minutes',
    servings: 1,
    images: [''],
    cuisineType: '',
    nutrition: { calories: '', protein: '', carbohydrates: '', fat: '' },
    isPublished: false,
  })
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const isEdit = Boolean(id)

  const totalTime = useMemo(() => {
    const prep = recipe.prepUnit === 'hours' ? Number(recipe.prepTime || 0) * 60 : Number(recipe.prepTime || 0)
    const cook = recipe.cookUnit === 'hours' ? Number(recipe.cookTime || 0) * 60 : Number(recipe.cookTime || 0)
    return prep + cook
  }, [recipe.prepTime, recipe.cookTime, recipe.prepUnit, recipe.cookUnit])

  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      const { data } = await api.get(`/recipes/${id}`)
      setRecipe((prev) => ({ ...prev, ...data, images: data.images?.length ? data.images : [''] }))
    })()
  }, [id, isEdit])

  const saveRecipe = async (publish) => {
    // DEBUG: open browser DevTools > Network tab > look for the POST /api/recipes request
    // Check: status code, request headers (Authorization present?), request body (data correct?), response body (error message?)
    if (user?.chefVerification?.status !== 'approved') {
      toast.error('Chef account is not verified yet. You cannot post recipes.')
      return
    }

    setErrorMessage('')
    const payload = {
      ...recipe,
      prepTime: recipe.prepUnit === 'hours' ? Number(recipe.prepTime || 0) * 60 : Number(recipe.prepTime || 0),
      cookTime: recipe.cookUnit === 'hours' ? Number(recipe.cookTime || 0) * 60 : Number(recipe.cookTime || 0),
      totalTime,
      tags: recipe.tags.filter(Boolean),
      images: recipe.images.filter(Boolean),
      ingredients: recipe.ingredients.filter((ingredient) => ingredient.name.trim()),
      instructions: recipe.instructions.filter((instruction) => instruction.trim()),
      isPublished: publish,
    }

    if (!payload.title.trim()) {
      toast.error('Please add at least the recipe title')
      return
    }

    if (publish && (!payload.description.trim() || payload.ingredients.length === 0 || payload.instructions.length === 0)) {
      toast.error('Please complete title, description, ingredients, and instructions')
      return
    }

    setSaving(true)
    try {
      console.log('Token being sent:', token)
      let uploadedImageUrl = ''
      if (imageFile) {
        const formData = new FormData()
        formData.append('image', imageFile)
        try {
          const uploadRes = await api.post('/recipes/upload', formData, { headers: { Authorization: `Bearer ${token}` } })
          uploadedImageUrl = uploadRes.data.url
        } catch (uploadError) {
          const uploadCode = uploadError?.response?.data?.code
          if (uploadCode === 'CLOUDINARY_NOT_CONFIGURED') {
            toast.warn('Image upload is not configured on server. Recipe will be saved without cover photo.')
          } else {
            throw uploadError
          }
        }
      }

      payload.images = [...payload.images, uploadedImageUrl].filter(Boolean)

      const response = isEdit
        ? await api.put(`/recipes/${id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
        : await api.post('/recipes', payload, { headers: { Authorization: `Bearer ${token}` } })
      toast.success(publish ? 'Recipe published' : 'Recipe saved as draft')
      navigate('/chef/recipes')
    } catch (error) {
      console.error('Recipe creation error:', error.response?.data || error.message)
      setErrorMessage(error.response?.data?.message || 'Something went wrong. Please try again.')
      toast.error(error.response?.data?.message || 'Could not save recipe')
    } finally {
      setSaving(false)
    }
  }

  const updateIngredient = (index, key, value) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ingredient, ingredientIndex) =>
        ingredientIndex === index ? { ...ingredient, [key]: value } : ingredient
      ),
    }))
  }

  const updateInstruction = (index, value) => {
    setRecipe((prev) => ({
      ...prev,
      instructions: prev.instructions.map((instruction, instructionIndex) => (instructionIndex === index ? value : instruction)),
    }))
  }

  const updateImage = (index, value) => {
    setRecipe((prev) => ({
      ...prev,
      images: prev.images.map((image, imageIndex) => (imageIndex === index ? value : image)),
    }))
  }

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6 pb-24">
      <ChefSidebar />
      <div className="card p-6 space-y-5">
        <h1 className="text-2xl font-bold">{isEdit ? 'Edit Recipe' : 'Add Recipe'}</h1>
        {user?.chefVerification?.status !== 'approved' && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-800 p-4">
            You have not been verified by admin yet, so you cannot post recipes.
          </div>
        )}

        <input maxLength={100} className="input-base" placeholder="Recipe title" value={recipe.title} onChange={(e) => setRecipe({ ...recipe, title: e.target.value })} />
        <textarea maxLength={300} className="input-base" placeholder="Description" value={recipe.description} onChange={(e) => setRecipe({ ...recipe, description: e.target.value })} />
        <p className="text-xs text-muted">{recipe.description.length}/300</p>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="flex gap-2"><input type="number" min="0" className="input-base" placeholder="Preparation time" value={recipe.prepTime} onChange={(e) => setRecipe({ ...recipe, prepTime: Number(e.target.value) })} /><select className="input-base max-w-[120px]" value={recipe.prepUnit} onChange={(e) => setRecipe({ ...recipe, prepUnit: e.target.value })}><option value="minutes">minutes</option><option value="hours">hours</option></select></div>
          <div className="flex gap-2"><input type="number" min="0" className="input-base" placeholder="Cook time" value={recipe.cookTime} onChange={(e) => setRecipe({ ...recipe, cookTime: Number(e.target.value) })} /><select className="input-base max-w-[120px]" value={recipe.cookUnit} onChange={(e) => setRecipe({ ...recipe, cookUnit: e.target.value })}><option value="minutes">minutes</option><option value="hours">hours</option></select></div>
          <input className="input-base" readOnly value={`${totalTime} minutes`} />
          <input type="number" min="1" className="input-base" placeholder="Servings" value={recipe.servings} onChange={(e) => setRecipe({ ...recipe, servings: Number(e.target.value) })} />
          <select className="input-base" value={recipe.difficulty} onChange={(e) => setRecipe({ ...recipe, difficulty: e.target.value })}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
          <select className="input-base md:col-span-2" value={recipe.category} onChange={(e) => setRecipe({ ...recipe, category: e.target.value })}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="dessert">Dessert</option>
            <option value="snack">Snack</option>
            <option value="beverage">Beverage</option>
          </select>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Cover Photo</h2>
          <label className="block border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer">
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp" onChange={(e) => {
              const file = e.target.files?.[0]
              if (!file) return
              if (file.size > 5 * 1024 * 1024) return toast.error('Maximum 5MB image size')
              setImageFile(file)
            }} />
            Drag and drop or click to upload image (jpg, jpeg, png, webp)
          </label>
          {imageFile && <div className="flex items-center gap-3"><img src={URL.createObjectURL(imageFile)} alt="Recipe preview" className="h-20 w-20 rounded object-cover" /><button type="button" className="btn-secondary" onClick={() => setImageFile(null)}>Remove</button></div>}
          <h2 className="font-semibold">Additional Photo URLs</h2>
          {recipe.images.map((image, index) => (
            <div className="flex gap-2" key={`image-${index}`}>
              <input className="input-base" placeholder="https://example.com/recipe-photo.jpg" value={image} onChange={(e) => updateImage(index, e.target.value)} />
              {recipe.images.length > 1 && (
                <button type="button" className="btn-primary" onClick={() => setRecipe((prev) => ({ ...prev, images: prev.images.filter((_, imageIndex) => imageIndex !== index) }))}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" onClick={() => setRecipe((prev) => ({ ...prev, images: [...prev.images, ''] }))}>Add Photo URL</button>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Ingredients (grams supported)</h2>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={`ingredient-${index}`} className="grid md:grid-cols-[1fr_120px_140px_auto] gap-2">
              <input className="input-base" placeholder="Ingredient name" value={ingredient.name} onChange={(e) => updateIngredient(index, 'name', e.target.value)} />
              <input type="number" min="0" step="0.1" className="input-base" placeholder="Quantity" value={ingredient.quantity} onChange={(e) => updateIngredient(index, 'quantity', Number(e.target.value))} />
              <select className="input-base" value={ingredient.unit} onChange={(e) => updateIngredient(index, 'unit', e.target.value)}>
                <option value="g">g (grams)</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="cup">cup</option>
                <option value="tbsp">tbsp</option>
                <option value="tsp">tsp</option>
                <option value="pcs">pcs</option>
              </select>
              {recipe.ingredients.length > 1 && (
                <button type="button" className="btn-primary" onClick={() => setRecipe((prev) => ({ ...prev, ingredients: prev.ingredients.filter((_, ingredientIndex) => ingredientIndex !== index) }))}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" onClick={() => setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, { name: '', quantity: 1, unit: 'g' }] }))}>Add Ingredient</button>
        </div>

        <div className="space-y-3">
          <h2 className="font-semibold">Cooking Instructions</h2>
          {recipe.instructions.map((instruction, index) => (
            <div key={`instruction-${index}`} className="flex gap-2">
              <textarea className="input-base" rows={2} placeholder={`Step ${index + 1}`} value={instruction} onChange={(e) => updateInstruction(index, e.target.value)} />
              {recipe.instructions.length > 1 && (
                <button type="button" className="btn-primary h-fit" onClick={() => setRecipe((prev) => ({ ...prev, instructions: prev.instructions.filter((_, instructionIndex) => instructionIndex !== index) }))}>Remove</button>
              )}
            </div>
          ))}
          <button type="button" className="btn-primary" onClick={() => setRecipe((prev) => ({ ...prev, instructions: [...prev.instructions, ''] }))}>Add Step</button>
        </div>

        <input className="input-base" placeholder="Tags (comma separated)" onChange={(e) => setRecipe((prev) => ({ ...prev, tags: e.target.value.split(',').map((item) => item.trim()) }))} />
        <input className="input-base" placeholder="Cuisine Type (e.g. Italian)" value={recipe.cuisineType} onChange={(e) => setRecipe((prev) => ({ ...prev, cuisineType: e.target.value }))} />
        <div className="grid md:grid-cols-4 gap-2">
          <input type="number" className="input-base" placeholder="Calories" value={recipe.nutrition.calories} onChange={(e) => setRecipe((prev) => ({ ...prev, nutrition: { ...prev.nutrition, calories: e.target.value } }))} />
          <input type="number" className="input-base" placeholder="Protein (g)" value={recipe.nutrition.protein} onChange={(e) => setRecipe((prev) => ({ ...prev, nutrition: { ...prev.nutrition, protein: e.target.value } }))} />
          <input type="number" className="input-base" placeholder="Carbohydrates (g)" value={recipe.nutrition.carbohydrates} onChange={(e) => setRecipe((prev) => ({ ...prev, nutrition: { ...prev.nutrition, carbohydrates: e.target.value } }))} />
          <input type="number" className="input-base" placeholder="Fat (g)" value={recipe.nutrition.fat} onChange={(e) => setRecipe((prev) => ({ ...prev, nutrition: { ...prev.nutrition, fat: e.target.value } }))} />
        </div>

        <div className="flex gap-3">
          <button type="button" disabled={saving} className="btn-primary" onClick={() => saveRecipe(false)}>{saving ? 'Saving...' : 'Save Draft'}</button>
          <button type="button" disabled={saving} className="btn-primary" onClick={() => saveRecipe(true)}>{saving ? 'Publishing...' : 'Publish Recipe'}</button>
        </div>
        {errorMessage && <p style={{ color: 'red', marginTop: '8px' }}>{errorMessage}</p>}
        {isEdit && recipe.updatedAt && <p className="text-xs text-muted">Last updated: {new Date(recipe.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
      </div>
    </div>
  )
}

export default RecipeEditorPage
