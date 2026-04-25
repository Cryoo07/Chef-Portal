import { Fragment, useEffect, useState } from 'react'
import { Bar, BarChart, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import ChefSidebar from '../components/ChefSidebar.jsx'

const ChefAnalyticsPage = () => {
  const { token } = useAuth()
  const [overview, setOverview] = useState({ summary: { views: 0, likes: 0, saves: 0, comments: 0 }, daily: [], recipes: [] })
  const [perRecipe, setPerRecipe] = useState([])
  const [expanded, setExpanded] = useState('')

  useEffect(() => {
    ;(async () => {
      const headers = { Authorization: `Bearer ${token}` }
      const [overviewRes, recipeRes] = await Promise.all([
        api.get('/analytics/chef', { headers }),
        api.get('/analytics/chef/recipes', { headers }),
      ])
      setOverview(overviewRes.data)
      setPerRecipe(recipeRes.data || [])
    })()
  }, [token])

  const pieByCategory = Object.values(
    perRecipe.reduce((acc, recipe) => {
      if (!acc[recipe.category]) acc[recipe.category] = { name: recipe.category, value: 0 }
      acc[recipe.category].value += recipe.views || 0
      return acc
    }, {})
  )

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      <ChefSidebar />
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Recipe Analytics</h1>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="card p-4">Views: <span className="font-bold text-primary">{overview.summary.views}</span></div>
          <div className="card p-4">Likes: <span className="font-bold text-primary">{overview.summary.likes}</span></div>
          <div className="card p-4">Saves: <span className="font-bold text-primary">{overview.summary.saves}</span></div>
          <div className="card p-4">Comments: <span className="font-bold text-primary">{overview.summary.comments}</span></div>
        </div>
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="card p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overview.daily}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#FF6B35" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perRecipe}>
                <XAxis dataKey="title" hide />
                <YAxis />
                <Tooltip />
                <Bar dataKey="likesCount" fill="#F59E0B" />
                <Bar dataKey="savesCount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="grid lg:grid-cols-[300px_1fr] gap-4">
          <div className="card p-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieByCategory} dataKey="value" outerRadius={90}>
                  {pieByCategory.map((entry) => <Cell key={entry.name} fill={entry.name === 'dinner' ? '#FF6B35' : '#F59E0B'} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="card p-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100"><tr><th className="p-2 text-left">Recipe Title</th><th className="p-2 text-left">Views</th><th className="p-2 text-left">Likes</th><th className="p-2 text-left">Saves</th><th className="p-2 text-left">Comments</th><th className="p-2 text-left">Published Date</th></tr></thead>
              <tbody>
                {perRecipe.map((recipe) => (
                  <Fragment key={recipe._id}>
                    <tr className="odd:bg-[#FAFAFA] hover:bg-[#FFF3EE] cursor-pointer" onClick={() => setExpanded((prev) => (prev === recipe._id ? '' : recipe._id))}>
                      <td className="p-2">{recipe.title}</td><td className="p-2">{recipe.views || 0}</td><td className="p-2">{recipe.likesCount || 0}</td><td className="p-2">{recipe.savesCount || 0}</td><td className="p-2">{recipe.commentsCount || 0}</td><td className="p-2">{new Date(recipe.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                    </tr>
                    {expanded === recipe._id && <tr><td className="p-2" colSpan={6}><div className="h-24"><ResponsiveContainer><LineChart data={recipe.sparkline7d || []}><XAxis dataKey="date" hide /><YAxis hide /><Line dataKey="views" stroke="#FF6B35" dot={false} /></LineChart></ResponsiveContainer></div></td></tr>}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChefAnalyticsPage
