import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-border sticky top-0 z-20">
      <div className="container-page h-16 flex items-center justify-between">
        <Link to="/" className="text-primary font-extrabold text-xl">
          🍳 Chef Portal
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-dark">
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/chefs">Chefs</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-dark">Login</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </>
          ) : (
            <>
              <Link to={user.role === 'admin' ? '/admin' : user.role === 'chef' ? '/chef/dashboard' : '/dashboard'}>
                Dashboard
              </Link>
              <button type="button" className="btn-primary" onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
