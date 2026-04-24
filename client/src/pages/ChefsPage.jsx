import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

const ChefsPage = () => {
  const [chefs, setChefs] = useState([])
  useEffect(() => {
    ;(async () => {
      const { data } = await api.get('/chefs')
      setChefs(data)
    })()
  }, [])

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chefs.map((chef) => (
        <Link key={chef._id} to={`/chefs/${chef._id}`} className="card p-4">
          <p className="font-bold">{chef.name}</p>
          <p className="text-secondary">{chef.speciality}</p>
          <p className="text-sm text-primary">{chef.recipeCount || 0} recipes</p>
        </Link>
      ))}
    </div>
  )
}

export default ChefsPage
