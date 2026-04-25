import { useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const sidebarLinkClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2 text-sm font-medium ${
    isActive ? 'bg-primary text-white' : 'text-mid hover:bg-[#FFF3EE]'
  }`

const PendingModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
    <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(event) => event.stopPropagation()}>
      <h3 className="text-lg font-bold">Approval Required</h3>
      <p className="text-sm text-muted mt-2">You need admin approval before you can post recipes. Check back soon!</p>
      <div className="mt-4 flex justify-end">
        <button type="button" className="btn-primary" onClick={onClose}>Close</button>
      </div>
    </div>
  </div>
)

const ChefSidebar = () => {
  const { user, logout } = useAuth()
  const isApproved = user?.isApproved && user?.chefVerification?.status === 'approved'
  const [showModal, setShowModal] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const onAddRecipeClick = (event) => {
    if (isApproved) return
    event.preventDefault()
    setShowModal(true)
  }

  const navItems = [
    { icon: 'https://img.icons8.com/fluency/48/home.png', label: 'Home', path: '/chef/dashboard' },
    { icon: 'https://img.icons8.com/fluency/48/book.png', label: 'My Recipes', path: '/chef/recipes' },
    { icon: 'https://img.icons8.com/fluency/48/plus-math.png', label: 'Add Recipe', path: '/chef/recipes/new', disabled: !isApproved, onClick: onAddRecipeClick },
    { icon: 'https://img.icons8.com/fluency/48/combo-chart.png', label: 'Analytics', path: '/chef/analytics' },
    { icon: 'https://img.icons8.com/fluency/48/user-male-circle.png', label: 'Profile', path: '/chef/profile' },
  ]

  return (
    <>
      {!isApproved && (
        <div className="lg:col-span-2 sticky top-16 z-20 bg-warning/10 border border-warning/30 text-warning rounded-lg p-3 text-sm font-medium">
          ⏳ Your chef account is pending admin approval. You cannot post recipes until approved.
        </div>
      )}
      <aside className="card p-4 h-fit hidden lg:block">
        <h2 className="text-lg font-bold mb-3">Chef Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink key={item.path} className={sidebarLinkClass} to={item.path} onClick={item.onClick}>
              <span className={`inline-flex items-center gap-2 ${item.disabled ? 'opacity-40' : ''}`}><img src={item.icon} alt={`${item.label} icon`} className="h-4 w-4" />{item.label}</span>
            </NavLink>
          ))}
          <button type="button" className="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-mid hover:bg-[#FFF3EE]" onClick={() => { logout(); navigate('/login') }}>
            <span className="inline-flex items-center gap-2"><img src="https://img.icons8.com/fluency/48/exit.png" alt="Logout icon" className="h-4 w-4" />Logout</span>
          </button>
        </nav>
      </aside>
      <nav className="fixed lg:hidden bottom-0 inset-x-0 z-40 border-t border-border bg-white px-2 py-2 flex justify-between">
        {navItems.map((item) => (
          <a key={item.path} href={item.path} onClick={item.onClick} className={`text-xs px-2 py-1 rounded ${location.pathname === item.path ? 'text-primary font-semibold' : 'text-muted'} ${item.disabled ? 'opacity-40' : ''}`}>
            <img src={item.icon} alt={`${item.label} icon`} className="h-4 w-4" />
          </a>
        ))}
        <button type="button" className="text-xs px-2 py-1 rounded text-muted" onClick={() => { logout(); navigate('/login') }}><img src="https://img.icons8.com/fluency/48/exit.png" alt="Logout icon" className="h-4 w-4" /></button>
      </nav>
      {showModal && <PendingModal onClose={() => setShowModal(false)} />}
    </>
  )
}

export default ChefSidebar
