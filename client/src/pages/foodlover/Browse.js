import { Link } from 'react-router-dom'

const Browse = () => {
  return (
    <div className="page-card">
      <h1>Browse Recipes</h1>
      <p>Explore approved recipes from chefs across the portal.</p>
      <ul>
        <li>
          <Link to="/recipe/1">Sample Recipe #1</Link>
        </li>
        <li>
          <Link to="/recipe/2">Sample Recipe #2</Link>
        </li>
      </ul>
    </div>
  )
}

export default Browse
