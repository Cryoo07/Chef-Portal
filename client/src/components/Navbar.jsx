import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { IMAGES, onImageErrorToFallback } from '../utils/images.js'

const Navbar = () => {
  const { user, logout } = useAuth()
  const [hasShadow, setHasShadow] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setHasShadow(window.scrollY > 6)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`bg-white border-b border-border sticky top-0 z-30 ${hasShadow ? 'shadow-sm' : ''}`}>
      <div className="container-page h-16 flex items-center justify-between">
        <Link to="/" className="text-[20px] font-bold text-primary tracking-tight flex items-center gap-2">
          <img src={IMAGES.fallback} alt="RecipeNest logo" loading="eager" onError={onImageErrorToFallback} className="h-7 w-7 rounded object-cover" />
          <span>RecipeNest</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-mid">
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/chefs">Chefs</NavLink>
        </nav>
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link to="/login" className="text-dark hover:text-primary">Login</Link>
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
          <button type="button" className="md:hidden btn-secondary" onClick={() => setDrawerOpen((value) => !value)}>
            ☰
          </button>
        </div>
      </div>
      {drawerOpen && (
        <div className="md:hidden border-t border-border bg-white">
          <div className="container-page py-3 flex flex-col gap-2 text-sm">
            <Link to="/recipes" onClick={() => setDrawerOpen(false)}>Recipes</Link>
            <Link to="/chefs" onClick={() => setDrawerOpen(false)}>Chefs</Link>
            {!user && (
              <>
                <Link to="/login" onClick={() => setDrawerOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setDrawerOpen(false)}>Register</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
