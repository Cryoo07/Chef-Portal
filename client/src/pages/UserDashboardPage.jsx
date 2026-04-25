import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'

const UserDashboardPage = () => {
  const { token, user, refreshMe } = useAuth()
  const [saved, setSaved] = useState([])
  const [liked, setLiked] = useState([])
  const [profile, setProfile] = useState({ name: '', avatar: '', bio: '' })
  useEffect(() => {
    ;(async () => {
      const headers = { Authorization: `Bearer ${token}` }
      const [savedRes, likedRes] = await Promise.all([
        api.get('/users/saved', { headers }),
        api.get('/users/liked', { headers }),
      ])
      setSaved(savedRes.data)
      setLiked(likedRes.data)
      setProfile({ name: user?.name || '', avatar: user?.avatar || '', bio: user?.bio || '' })
    })()
  }, [token, user])

  const onSaveProfile = async (e) => {
    e.preventDefault()
    await api.put('/users/profile', profile, { headers: { Authorization: `Bearer ${token}` } })
    await refreshMe()
    toast.success('Profile updated')
  }

  return (
    <div className="space-y-6">
      <div className="card p-6"><h1 className="text-2xl font-bold">Welcome, {user?.name}</h1></div>
      {user?.chefVerification?.status === 'pending' && (
        <div className="card p-4 border border-amber-200 bg-amber-50 text-amber-800">
          Your chef application is pending admin verification. You cannot post recipes until approved.
        </div>
      )}
      {user?.chefVerification?.status === 'rejected' && (
        <div className="card p-4 border border-red-200 bg-red-50 text-red-700">
          Your chef application was rejected. Update your details and apply again.
        </div>
      )}
      <form className="card p-6 space-y-3" onSubmit={onSaveProfile}>
        <h2 className="text-lg font-semibold">Edit Profile</h2>
        <input className="input-base" value={profile.name} onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))} placeholder="Name" />
        <input className="input-base" value={profile.avatar} onChange={(e) => setProfile((p) => ({ ...p, avatar: e.target.value }))} placeholder="Avatar URL" />
        <textarea className="input-base" rows={3} value={profile.bio} onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))} placeholder="Bio" />
        <button className="btn-primary">Save Profile</button>
      </form>
      <div className="card p-6 space-y-2">
        <h2 className="font-semibold mb-2">Saved Recipes</h2>
        {saved.map((r) => <Link className="block hover:text-primary" key={r._id} to={`/recipes/${r._id}`}>{r.title}</Link>)}
      </div>
      <div className="card p-6 space-y-2">
        <h2 className="font-semibold mb-2">Liked Recipes</h2>
        {liked.map((r) => <Link className="block hover:text-primary" key={r._id} to={`/recipes/${r._id}`}>{r.title}</Link>)}
      </div>
    </div>
  )
}

export default UserDashboardPage
