import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'

const AdminChefApplicationsPage = () => {
  const { token } = useAuth()
  const [tab, setTab] = useState('pending')
  const [items, setItems] = useState([])
  const [pendingCount, setPendingCount] = useState(0)

  const load = async (nextTab = tab) => {
    const headers = { Authorization: `Bearer ${token}` }
    const [listRes, pendingRes] = await Promise.all([
      api.get('/admin/chef-applications', { headers, params: { tab: nextTab } }),
      api.get('/admin/chef-applications', { headers, params: { tab: 'pending' } }),
    ])
    setItems(listRes.data || [])
    setPendingCount((pendingRes.data || []).length)
  }

  useEffect(() => { load() }, [token, tab])

  const approve = async (id) => {
    await api.put(`/admin/approve-chef/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Chef approved successfully')
    load()
  }

  const reject = async (user) => {
    const reason = window.prompt(`Are you sure you want to reject ${user.name}'s application? Enter reason:`) || ''
    await api.put(`/admin/reject-chef/${user._id}`, { reason }, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Chef rejected')
    load()
  }

  const revoke = async (id) => {
    await api.put(`/admin/revoke-chef/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('Approval revoked')
    load()
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <AdminSidebar pendingCount={pendingCount} />
      <div className="card p-6 overflow-x-auto">
        <div className="flex gap-2 mb-4">
          <button className={`btn-secondary ${tab === 'pending' ? '!bg-primary !text-white' : ''}`} onClick={() => setTab('pending')}>Pending ({pendingCount})</button>
          <button className={`btn-secondary ${tab === 'approved' ? '!bg-primary !text-white' : ''}`} onClick={() => setTab('approved')}>Approved Chefs ({tab === 'approved' ? items.length : '-'})</button>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Speciality</th><th className="p-2 text-left">Experience</th><th className="p-2 text-left">Applied On</th><th className="p-2 text-left">Portfolio Links</th><th className="p-2 text-left">Actions</th></tr></thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id} className="odd:bg-[#FAFAFA] hover:bg-[#FFF3EE]">
                <td className="p-2">{item.name}</td><td className="p-2">{item.email}</td><td className="p-2">{item.speciality || '-'}</td><td className="p-2">{item.yearsOfExperience || 0}</td>
                <td className="p-2">{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td>
                <td className="p-2 space-x-2">
                  {item.socialLinks?.instagram ? <a href={item.socialLinks.instagram} target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/fluency/48/instagram-new.png" alt="Instagram" className="h-4 w-4 inline" /></a> : <span className="text-gray-400">-</span>}
                  {item.socialLinks?.youtube ? <a href={item.socialLinks.youtube} target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/fluency/48/youtube-play.png" alt="YouTube" className="h-4 w-4 inline" /></a> : <span className="text-gray-400">-</span>}
                  {item.socialLinks?.website ? <a href={item.socialLinks.website} target="_blank" rel="noopener noreferrer"><img src="https://img.icons8.com/fluency/48/domain.png" alt="Website" className="h-4 w-4 inline" /></a> : <span className="text-gray-400">-</span>}
                </td>
                <td className="p-2 space-x-2">{tab === 'pending' ? (<><button className="text-green-600" onClick={() => approve(item._id)}>Approve</button><button className="text-red-600" onClick={() => reject(item)}>Reject</button></>) : <button className="text-red-600" onClick={() => revoke(item._id)}>Revoke</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminChefApplicationsPage
