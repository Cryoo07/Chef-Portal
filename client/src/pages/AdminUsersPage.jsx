import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import api from '../lib/api'
import { useAuth } from '../context/AuthContext.jsx'
import AdminSidebar from '../components/AdminSidebar.jsx'

const AdminUsersPage = () => {
  const { token } = useAuth()
  const [search, setSearch] = useState('')
  const [users, setUsers] = useState([])

  const load = async () => {
    const { data } = await api.get('/admin/users', { headers: { Authorization: `Bearer ${token}` }, params: { search } })
    setUsers(data || [])
  }

  useEffect(() => { load() }, [token, search])

  const toggleStatus = async (user) => {
    await api.put(`/admin/users/${user._id}/status`, { isActive: !user.isActive }, { headers: { Authorization: `Bearer ${token}` } })
    toast.success(user.isActive ? 'User suspended' : 'User activated')
    load()
  }

  const remove = async (id) => {
    if (!window.confirm('Delete user account?')) return
    await api.delete(`/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } })
    toast.success('User deleted')
    load()
  }

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-6">
      <AdminSidebar />
      <div className="card p-6 overflow-x-auto">
        <h1 className="text-2xl font-bold mb-4">All Users</h1>
        <input className="input-base mb-3" placeholder="Search users..." onChange={(e) => setSearch(e.target.value)} />
        <table className="w-full text-sm">
          <thead className="bg-gray-100"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th><th className="p-2 text-left">Saved Recipes</th><th className="p-2 text-left">Joined Date</th><th className="p-2 text-left">Status</th><th className="p-2 text-left">Actions</th></tr></thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="odd:bg-[#FAFAFA] hover:bg-[#FFF3EE]">
                <td className="p-2">{user.name}</td><td className="p-2">{user.email}</td><td className="p-2">{user.savedRecipes?.length || 0}</td><td className="p-2">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</td><td className="p-2">{user.isActive ? 'Active' : 'Suspended'}</td>
                <td className="p-2 space-x-2"><button type="button" onClick={() => toggleStatus(user)}>{user.isActive ? 'Suspend' : 'Activate'}</button><button type="button" onClick={() => remove(user._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsersPage
