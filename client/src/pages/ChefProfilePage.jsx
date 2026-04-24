import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../lib/api'

const ChefProfilePage = () => {
  const { id } = useParams()
  const [data, setData] = useState(null)
  useEffect(() => {
    ;(async () => setData((await api.get(`/chefs/${id}`)).data))()
  }, [id])
  if (!data) return <div className="card p-6">Loading...</div>
  return (
    <div className="space-y-4">
      <div className="card p-6">
        <h1 className="text-2xl font-bold">{data.chef.name}</h1>
        <p className="text-secondary">{data.chef.bio || data.chef.speciality}</p>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {data.recipes.map((r) => <div key={r._id} className="card p-4">{r.title}</div>)}
      </div>
    </div>
  )
}

export default ChefProfilePage
