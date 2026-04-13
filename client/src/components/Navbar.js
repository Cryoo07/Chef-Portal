import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Chef Portal</Link>
      </div>
      <div className="navbar-links">
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && user.role === 'admin' && (
          <>
            <Link to="/admin">Dashboard</Link>
            <Link to="/admin/chefs">Chefs</Link>
            <Link to="/admin/recipes">Recipes</Link>
          </>
        )}

        {user && user.role === 'chef' && (
          <>
            <Link to="/chef">Dashboard</Link>
            <Link to="/chef/add">Add Recipe</Link>
            <Link to="/chef/my">My Recipes</Link>
          </>
        )}

        {user && user.role === 'foodlover' && <Link to="/browse">Browse</Link>}

        {user && (
          <>
            <span className="navbar-user">{user.name}</span>
            <button className="navbar-logout" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
