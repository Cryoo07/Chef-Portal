import { useEffect, useState } from 'react'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const UserDashboardPage = () => {
  const { token, user } = useAuth()
  const [saved, setSaved] = useState([])
  const [liked, setLiked] = useState([])
  useEffect(() => {
    ;(async () => {
      const headers = { Authorization: `Bearer ${token}` }
      const [savedRes, likedRes] = await Promise.all([
        api.get('/users/saved', { headers }),
        api.get('/users/liked', { headers }),
      ])
      setSaved(savedRes.data)
      setLiked(likedRes.data)
    })()
  }, [token])

  return (
    <div className="space-y-6">
      <div className="card p-6"><h1 className="text-2xl font-bold">Welcome, {user?.name}</h1></div>
      <div className="card p-6"><h2 className="font-semibold mb-2">Saved Recipes</h2>{saved.map((r) => <p key={r._id}>{r.title}</p>)}</div>
      <div className="card p-6"><h2 className="font-semibold mb-2">Liked Recipes</h2>{liked.map((r) => <p key={r._id}>{r.title}</p>)}</div>
    </div>
  )
}

export default UserDashboardPage
