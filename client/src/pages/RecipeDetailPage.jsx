import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import { getRecipeImage, onImageErrorToFallback } from '../utils/images.js'

const RecipeDetailPage = () => {
  const { id } = useParams()
  const { token, user } = useAuth()
  const [recipe, setRecipe] = useState(null)
  const [comments, setComments] = useState([])
  const [ratingsCount, setRatingsCount] = useState(0)
  const [avgRating, setAvgRating] = useState(0)
  const [commentForm, setCommentForm] = useState({ text: '', rating: 5 })
  const [saved, setSaved] = useState(false)

  const authHeaders = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token])

  const loadComments = async () => {
    const { data } = await api.get(`/comments/recipe/${id}`)
    setComments(data.comments || [])
    setAvgRating(data.avgRating || 0)
    setRatingsCount(data.ratingsCount || 0)
  }

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get(`/recipes/${id}`)
      setRecipe(data)
      const stored = localStorage.getItem('recent_recipe_views')
      const parsed = stored ? JSON.parse(stored) : []
      const next = [data._id, ...parsed.filter((item) => item !== data._id)].slice(0, 12)
      localStorage.setItem('recent_recipe_views', JSON.stringify(next))
      if (user?.savedRecipes?.length) {
        setSaved(user.savedRecipes.includes(data._id))
      }
      await loadComments()
    })()
  }, [id, user])

  const onSaveRecipe = async () => {
    if (!token) return toast.error('Please login to save recipes')
    const { data } = await api.post(`/recipes/${id}/save`, {}, { headers: authHeaders })
    setSaved(data.saved)
    toast.success(data.saved ? 'Recipe saved' : 'Recipe removed from saved')
  }

  const onSubmitComment = async (e) => {
    e.preventDefault()
    if (!token) return toast.error('Please login to comment')
    if (!commentForm.text.trim()) return toast.error('Please write a comment')
    await api.post(`/comments/${id}`, commentForm, { headers: authHeaders })
    setCommentForm({ text: '', rating: 5 })
    await loadComments()
    toast.success('Comment posted')
  }

  if (!recipe) return <div className="card p-6">Loading...</div>
  return (
    <article className="space-y-6">
      <section className="card p-6 space-y-4">
        {recipe.images?.[0] ? (
          <img src={recipe.images[0]} alt={`${recipe.title} recipe`} loading="eager" onError={onImageErrorToFallback} className="w-full h-80 object-cover rounded-xl" />
        ) : (
          <div className="w-full h-80 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFF3EE, #FF6B35)' }}>
            <img src={getRecipeImage(recipe)} alt="Recipe cover placeholder" loading="eager" onError={onImageErrorToFallback} className="h-44 w-44 rounded-full object-cover border-4 border-white/70" />
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <p className="text-sm text-secondary">By {recipe.chef?.name}</p>
          </div>
          <button type="button" className="btn-primary" onClick={onSaveRecipe}>
            {saved ? 'Saved' : 'Save Recipe'}
          </button>
        </div>
        <p className="text-secondary">{recipe.description}</p>
        <p className="text-sm text-secondary">Rating: {avgRating.toFixed(1)} / 5 ({ratingsCount} ratings)</p>
        <div>
          <h2 className="font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc pl-5">
            {recipe.ingredients?.map((i, idx) => <li key={idx}>{i.quantity} {i.unit} {i.name}</li>)}
          </ul>
        </div>
      </section>

      <section className="card p-6 space-y-4">
        <h2 className="text-xl font-semibold">Ratings & Comments</h2>
        <form onSubmit={onSubmitComment} className="space-y-3">
          <select
            className="input-base"
            value={commentForm.rating}
            onChange={(e) => setCommentForm((prev) => ({ ...prev, rating: Number(e.target.value) }))}
          >
            {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} Star</option>)}
          </select>
          <textarea
            className="input-base"
            rows={3}
            placeholder="Share your feedback"
            value={commentForm.text}
            onChange={(e) => setCommentForm((prev) => ({ ...prev, text: e.target.value }))}
          />
          <button className="btn-primary">Post Comment</button>
        </form>
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment._id} className="rounded-xl border border-border p-4">
              <p className="font-semibold">{comment.user?.name}</p>
              <p className="text-sm text-secondary">{'★'.repeat(comment.rating)}{'☆'.repeat(5 - comment.rating)}</p>
              <p className="text-sm mt-2">{comment.text}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}

export default RecipeDetailPage
