import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { IMAGES, onImageErrorToFallback } from '../utils/images.js'

const Footer = () => {
  const { user } = useAuth()
  const isChef = user?.role === 'chef'
  const isAdmin = user?.role === 'admin'

  return (
    <footer className="bg-white border-t-2 border-primary mt-8">
      <div className="container-page py-10 text-sm text-secondary grid md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <p className="text-primary font-bold text-lg flex items-center gap-2">
            <img src={IMAGES.fallback} alt="RecipeNest logo" loading="lazy" onError={onImageErrorToFallback} className="h-6 w-6 rounded object-cover" />
            <span>RecipeNest</span>
          </p>
          <p className="mt-2">Discover and share chef-crafted recipes with a clean, modern cooking experience.</p>
        </div>
        <div>
          <p className="font-semibold text-dark mb-2">Explore</p>
          <div className="space-y-1">
            <Link className="block hover:text-primary" to="/">Home</Link>
            <Link className="block hover:text-primary" to="/recipes">Recipes</Link>
            <Link className="block hover:text-primary" to="/chefs">Chefs</Link>
          </div>
        </div>
        <div>
          <p className="font-semibold text-dark mb-2">Community</p>
          <div className="space-y-1">
            {!user && <Link className="block hover:text-primary" to="/register">Join</Link>}
            {user?.role === 'user' && <Link className="block hover:text-primary" to="/dashboard">Saved Recipes</Link>}
            {user?.role === 'chef' && <Link className="block hover:text-primary" to="/saved">Saved Recipes</Link>}
            {!user && <Link className="block hover:text-primary" to="/login">Account</Link>}
            {isAdmin && <Link className="block hover:text-primary" to="/admin">Admin Dashboard</Link>}
          </div>
        </div>
        <div>
          <p className="font-semibold text-dark mb-2">For Chefs</p>
          <div className="space-y-1">
            {!isChef && !isAdmin && <Link className="block hover:text-primary" to="/register">Apply as Chef</Link>}
            {isChef && <Link className="block hover:text-primary" to="/chef/dashboard">Chef Dashboard</Link>}
            {isChef && <Link className="block hover:text-primary" to="/chef/analytics">Analytics</Link>}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
