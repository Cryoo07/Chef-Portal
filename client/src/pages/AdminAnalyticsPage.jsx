import { useEffect, useState } from 'react'
import { Bar, BarChart, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const AdminAnalyticsPage = () => {
  const { token } = useAuth()
  const [data, setData] = useState({ users: 0, chefs: 0, recipes: 0, analytics: [] })

  useEffect(() => {
    ;(async () => {
      const res = await api.get('/admin/analytics', { headers: { Authorization: `Bearer ${token}` } })
      setData(res.data)
    })()
  }, [token])

  const pieData = [{ name: 'Users', value: data.users }, { name: 'Chefs', value: data.chefs }, { name: 'Recipes', value: data.recipes }]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Website Analytics</h1>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="card p-4 h-72 lg:col-span-2">
          <ResponsiveContainer>
            <LineChart data={data.analytics}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="views" stroke="#FF6B35" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="card p-4 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} fill="#FF6B35" />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card p-4 h-72">
        <ResponsiveContainer>
          <BarChart data={data.analytics}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="likes" fill="#FF8C5A" />
            <Bar dataKey="saves" fill="#FB923C" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminAnalyticsPage
