import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import ChefSidebar from '../components/ChefSidebar.jsx'
import { IMAGES, onImageErrorToFallback } from '../utils/images.js'

const ChefDashboardPage = () => {
  const { token, user } = useAuth()
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
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      <ChefSidebar />
      <div className="space-y-6">
        <div className="relative overflow-hidden rounded-xl min-h-[160px]">
          <img src={IMAGES.chefDashboard} alt="Chef dashboard banner" loading="eager" onError={onImageErrorToFallback} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
          <div className="relative z-10 p-6 text-white">
            <h1 className="text-2xl font-bold">Welcome back, Chef {user?.name || ''}</h1>
            <p className="text-sm text-gray-100 mt-1">Track your recipe performance and publish new dishes.</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Chef Dashboard</h1>
          <div className="flex gap-3">
            <Link className="btn-primary" to="/chef/analytics">Recipe Analytics</Link>
            <Link className="btn-primary" to="/chef/recipes/new">Add New Recipe</Link>
          </div>
        </div>
        {user?.chefVerification?.status !== 'approved' && (
          <div className="card p-4 border border-amber-200 bg-amber-50 text-amber-800">
            Your chef account is not verified yet. You cannot post recipes until admin approval.
          </div>
        )}
        <div className="grid md:grid-cols-4 gap-4">{stats.map(([label, value]) => <div className="card p-4" key={label}><p>{label}</p><p className="text-xl font-bold text-primary">{value}</p></div>)}</div>
        <div className="card p-6 text-secondary">Analytics charts are now available on the dedicated analytics page.</div>
      </div>
    </div>
  )
}

export default ChefDashboardPage
