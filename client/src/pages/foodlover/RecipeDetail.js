import { useParams } from 'react-router-dom'

const RecipeDetail = () => {
  const { id } = useParams()

  return (
    <div className="page-card">
      <h1>Recipe Details</h1>
      <p>Recipe ID: {id}</p>
      <p>This page can display a recipe summary, ingredients, and cooking instructions.</p>
    </div>
  )
}

export default RecipeDetail
