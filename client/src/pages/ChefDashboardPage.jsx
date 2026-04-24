import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const ChefDashboardPage = () => {
  const { token } = useAuth()
  const [overview, setOverview] = useState({ summary: { views: 0, likes: 0, saves: 0 }, daily: [], recipesCount: 0 })

  useEffect(() => {
    ;(async () => {
      const { data } = await api.get('/analytics/overview', { headers: { Authorization: `Bearer ${token}` } })
      setOverview(data)
    })()
  }, [token])

  const stats = useMemo(
    () => [
      ['Total Recipes', overview.recipesCount],
      ['Total Views', overview.summary.views],
      ['Total Likes', overview.summary.likes],
      ['Total Saves', overview.summary.saves],
    ],
    [overview]
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center"><h1 className="text-2xl font-bold">Chef Dashboard</h1><Link className="btn-primary" to="/chef/recipes/new">Add New Recipe</Link></div>
      <div className="grid md:grid-cols-4 gap-4">{stats.map(([label, value]) => <div className="card p-4" key={label}><p>{label}</p><p className="text-xl font-bold text-primary">{value}</p></div>)}</div>
      <div className="card p-6 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={overview.daily}>
            <XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="views" stroke="#FF6B35" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ChefDashboardPage
