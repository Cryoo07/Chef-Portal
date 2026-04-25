import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const itemClass = ({ isActive }) =>
  `block rounded-lg px-4 py-2 text-sm font-medium ${isActive ? 'bg-primary text-white' : 'text-mid hover:bg-[#FFF3EE]'}`

const AdminSidebar = ({ pendingCount = 0 }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <aside className="card p-4 h-fit">
      <h2 className="text-lg font-bold mb-3">Admin Panel</h2>
      <nav className="space-y-2">
        <NavLink to="/admin" className={itemClass}><span className="inline-flex items-center gap-2"><img src="https://img.icons8.com/fluency/48/combo-chart.png" alt="Dashboard icon" className="h-4 w-4" />Dashboard</span></NavLink>
        <NavLink to="/admin/chef-applications" className={itemClass}><span className="inline-flex items-center gap-2"><img src="https://img.icons8.com/fluency/48/chef-hat.png" alt="Chef applications icon" className="h-4 w-4" />Chef Applications {pendingCount > 0 ? `(${pendingCount})` : ''}</span></NavLink>
        <NavLink to="/admin/recipes" className={itemClass}><span className="inline-flex items-center gap-2"><img src="https://img.icons8.com/fluency/48/book.png" alt="Recipes icon" className="h-4 w-4" />All Recipes</span></NavLink>
        <NavLink to="/admin/users" className={itemClass}><span className="inline-flex items-center gap-2"><img src="https://img.icons8.com/fluency/48/conference-call.png" alt="Users icon" className="h-4 w-4" />All Users</span></NavLink>
        <button type="button" className="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-mid hover:bg-[#FFF3EE]" onClick={() => { logout(); navigate('/login') }}>
          <span className="inline-flex items-center gap-2"><img src="https://img.icons8.com/fluency/48/exit.png" alt="Logout icon" className="h-4 w-4" />Logout</span>
        </button>
      </nav>
    </aside>
  )
}

export default AdminSidebar
