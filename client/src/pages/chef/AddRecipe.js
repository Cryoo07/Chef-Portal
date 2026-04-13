import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const AddRecipe = () => {
  const { authHeaders, API_BASE } = useAuth()
  const [form, setForm] = useState({ title: '', description: '', ingredients: '' })
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const response = await fetch(`${API_BASE}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        ingredients: form.ingredients.split(',').map((item) => item.trim()),
      }),
    })

    const result = await response.json()
    setMessage(result.message || 'Recipe submitted successfully')
  }

  return (
    <div className="page-card">
      <h1>Add Recipe</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="4" required />
        </div>
        <div className="form-group">
          <label>Ingredients (comma separated)</label>
          <input name="ingredients" value={form.ingredients} onChange={handleChange} />
        </div>
        <button className="primary" type="submit">Submit Recipe</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default AddRecipe
