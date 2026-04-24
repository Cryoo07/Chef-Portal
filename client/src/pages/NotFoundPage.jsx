import { Link } from 'react-router-dom'

const NotFoundPage = () => (
  <div className="card p-8 text-center">
    <h1 className="text-4xl font-bold text-primary">404</h1>
    <p className="text-secondary mt-2">Oops! The page you are looking for does not exist.</p>
    <Link to="/" className="btn-primary inline-block mt-4">Go Home</Link>
  </div>
)

export default NotFoundPage
