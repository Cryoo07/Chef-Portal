import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import ChefSidebar from '../components/ChefSidebar.jsx'

const ChefProfileSettingsPage = () => {
  const { token, user, refreshMe } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    avatar: '',
    bio: '',
    speciality: '',
    yearsOfExperience: 0,
    socialLinks: { instagram: '', youtube: '', website: '' },
  })

  useEffect(() => {
    setProfile({
      name: user?.name || '',
      avatar: user?.avatar || '',
      bio: user?.bio || '',
      speciality: user?.speciality || '',
      yearsOfExperience: user?.yearsOfExperience || 0,
      socialLinks: {
        instagram: user?.socialLinks?.instagram || '',
        youtube: user?.socialLinks?.youtube || '',
        website: user?.socialLinks?.website || '',
      },
    })
  }, [user])

  const updateLink = (field, value) => {
    setProfile((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [field]: value } }))
  }

  const onSave = async (e) => {
    e.preventDefault()
    try {
      await api.put('/users/profile', profile, { headers: { Authorization: `Bearer ${token}` } })
      await refreshMe()
      toast.success('Chef profile updated')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile')
    }
  }

  return (
    <div className="grid lg:grid-cols-[240px_1fr] gap-6">
      <ChefSidebar />
      <form onSubmit={onSave} className="card p-6 space-y-3">
        <h1 className="text-2xl font-bold">Chef Profile</h1>
        <input className="input-base" value={profile.name} onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" />
        <input className="input-base" value={profile.avatar} onChange={(e) => setProfile((prev) => ({ ...prev, avatar: e.target.value }))} placeholder="Avatar URL" />
        <textarea className="input-base" rows={3} value={profile.bio} onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))} placeholder="Bio" />
        <input className="input-base" value={profile.speciality} onChange={(e) => setProfile((prev) => ({ ...prev, speciality: e.target.value }))} placeholder="Speciality" />
        <input type="number" className="input-base" min="0" value={profile.yearsOfExperience} onChange={(e) => setProfile((prev) => ({ ...prev, yearsOfExperience: Number(e.target.value) }))} placeholder="Years of experience" />
        <input className="input-base" value={profile.socialLinks.instagram} onChange={(e) => updateLink('instagram', e.target.value)} placeholder="Instagram URL" />
        <input className="input-base" value={profile.socialLinks.youtube} onChange={(e) => updateLink('youtube', e.target.value)} placeholder="YouTube URL" />
        <input className="input-base" value={profile.socialLinks.website} onChange={(e) => updateLink('website', e.target.value)} placeholder="Website URL" />
        <button className="btn-primary w-fit">Save Profile</button>
      </form>
    </div>
  )
}

export default ChefProfileSettingsPage
