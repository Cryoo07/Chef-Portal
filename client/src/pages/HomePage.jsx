import { Link } from 'react-router-dom'

const HomePage = () => (
  <div className="space-y-8">
    <section className="card p-8 bg-gradient-to-r from-primaryTint to-white">
      <h1 className="text-4xl font-extrabold text-dark">Discover Recipes From Real Chefs</h1>
      <p className="text-secondary mt-3">Chef Portal is your chef portfolio and recipe sharing platform.</p>
      <Link to="/recipes" className="btn-primary inline-block mt-6">Explore Recipes</Link>
    </section>
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {['Total Recipes', 'Total Chefs', 'Total Users'].map((item) => (
        <div key={item} className="card p-5"><p className="text-secondary">{item}</p><p className="text-2xl font-bold text-primary">--</p></div>
      ))}
    </section>
  </div>
)

export default HomePage
