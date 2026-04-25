import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'
import { IMAGES, onImageErrorToFallback } from '../utils/images.js'

const filters = ['All', 'Italian', 'Mexican', 'Indian', 'French', 'Japanese', 'American']

const ChefsPage = () => {
  const [chefs, setChefs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  useEffect(() => {
    ;(async () => {
      const { data } = await api.get('/chefs')
      setChefs(data)
      setLoading(false)
    })()
  }, [])

  const filtered = chefs.filter((chef) => {
    const byFilter = activeFilter === 'All' || chef.speciality?.toLowerCase().includes(activeFilter.toLowerCase())
    const bySearch = chef.name?.toLowerCase().includes(search.toLowerCase()) || chef.speciality?.toLowerCase().includes(search.toLowerCase())
    return byFilter && bySearch
  })

  return (
    <div className="space-y-6">
      <section className="rounded-3xl p-8 text-white relative overflow-hidden">
        <img src={IMAGES.chefsBanner} alt="Chefs page banner" loading="eager" onError={onImageErrorToFallback} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
        <h1 className="text-4xl font-extrabold relative z-10">Meet Our Chefs</h1>
        <p className="mt-2 text-orange-50 relative z-10">Talented culinary professionals sharing their passion through recipes</p>
        <input
          className="mt-5 w-full md:w-96 rounded-xl px-4 py-3 text-dark outline-none relative z-10"
          placeholder="Search by name or cuisine..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full border ${activeFilter === filter ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-primary'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, idx) => <div key={idx} className="skeleton h-56" />)}
        </div>
      ) : filtered.length === 0 ? (
          <div className="empty-state">
            <img src={IMAGES.fallback} alt="No chefs found" loading="lazy" onError={onImageErrorToFallback} className="h-24 w-24 rounded-full object-cover mx-auto mb-2" />
          <p className="font-semibold text-dark">No chefs found yet</p>
          <p>Try another cuisine filter or search term.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((chef) => {
            const initials = chef.name
              .split(' ')
              .map((word) => word[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
            return (
              <div key={chef._id} className="card p-5 interactive hover:scale-[1.02]">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold flex items-center justify-center text-lg">
                  {initials}
                </div>
                <p className="font-bold text-lg mt-4">{chef.name}</p>
                <span className="inline-block text-xs mt-1 rounded-full bg-orange-100 text-orange-700 px-3 py-1">{chef.speciality || 'General Cuisine'}</span>
                <p className="text-sm text-secondary truncate mt-3">{chef.bio || 'Passionate culinary professional creating flavorful recipes for everyone.'}</p>
                <div className="flex items-center gap-4 text-sm mt-4">
                  <span>Recipes: {chef.recipeCount || 0}</span>
                  <span>Followers: {chef.followers?.length || 0}</span>
                </div>
                <Link to={`/chefs/${chef._id}`} className="mt-5 block w-full text-center rounded-xl border border-primary text-primary py-2 hover:bg-orange-50">
                  View Profile
                </Link>
              </div>
            )
          })}
        </div>
      )}

      <section className="grid md:grid-cols-3 gap-4">
          {[
            [IMAGES.chefsBanner, '8 Expert Chefs'],
            [IMAGES.recipesBanner, '50+ Recipes'],
            [IMAGES.hero, '1,000+ Happy Cooks'],
          ].map(([image, label]) => (
          <div key={label} className="rounded-2xl bg-orange-50 border border-orange-100 p-6 text-center">
              <img src={image} alt={label} loading="lazy" onError={onImageErrorToFallback} className="h-12 w-12 rounded-full object-cover mx-auto" />
            <p className="mt-2 font-bold text-lg">{label}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default ChefsPage
