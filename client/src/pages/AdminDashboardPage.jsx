import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'

const AdminDashboardPage = () => {
  const { token } = useAuth()
  const [data, setData] = useState({ users: 0, chefs: 0, recipes: 0, pendingChefRequests: 0, analytics: [], registrations: [], recipesByCategory: [], topRecipes: [], topActiveChefs: [], recentApplications: [] })
  useEffect(() => {
    ;(async () => {
      const headers = { Authorization: `Bearer ${token}` }
      const analyticsRes = await api.get('/admin/analytics', { headers })
      setData(analyticsRes.data)
    })()
  }, [token])

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <AdminSidebar pendingCount={data.pendingChefRequests} />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card p-4">Total Users: <span className="text-primary font-bold">{data.users}</span></div>
          <div className="card p-4">Total Chefs: <span className="text-primary font-bold">{data.chefs}</span></div>
          <div className="card p-4">Total Recipes: <span className="text-primary font-bold">{data.recipes}</span></div>
          <div className="card p-4">Pending Applications: <span className={`${data.pendingChefRequests > 0 ? 'text-warning' : 'text-primary'} font-bold`}>{data.pendingChefRequests}</span></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-4 h-72">
            <ResponsiveContainer>
              <LineChart data={data.registrations}>
                <XAxis dataKey="date" /><YAxis /><Tooltip /><Line dataKey="total" stroke="#FF6B35" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4 h-72">
            <ResponsiveContainer>
              <BarChart data={data.recipesByCategory}>
                <XAxis dataKey="category" /><YAxis /><Tooltip /><Bar dataKey="total" fill="#FF6B35" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Top 5 Most Viewed Recipes</h2>
            <div className="space-y-2">{data.topRecipes.map((item) => <div key={item._id} className="text-sm"><p className="font-medium">{item.title}</p><p className="text-muted">{item.chef?.name} · {item.views} views · {item.likes?.length || 0} likes</p></div>)}</div>
          </div>
          <div className="card p-4">
            <h2 className="font-semibold mb-2">Top 5 Most Active Chefs</h2>
            <div className="space-y-2">{data.topActiveChefs.map((item) => <div key={item._id} className="text-sm"><p className="font-medium">{item.chef?.name || 'Unknown'}</p><p className="text-muted">{item.recipeCount} recipes · {item.totalViews} views</p></div>)}</div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold mb-2">Recent Chef Applications</h2><Link className="text-primary text-sm" to="/admin/chef-applications">Review All</Link></div>
            <div className="space-y-2">{data.recentApplications.map((item) => <div key={item._id} className="text-sm"><p className="font-medium">{item.name}</p><p className="text-muted">{item.email}</p></div>)}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link className="btn-secondary" to="/admin/analytics">Open Analytics</Link>
          <Link className="btn-secondary" to="/admin/users">Manage Users</Link>
          <Link className="btn-secondary" to="/admin/recipes">Manage Recipes</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
