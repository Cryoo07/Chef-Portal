import { Link } from 'react-router-dom'

const Footer = () => (
  <footer className="bg-white border-t-2 border-primary mt-8">
    <div className="container-page py-8 text-sm text-secondary flex flex-col md:flex-row md:justify-between gap-4">
      <div>
        <p className="text-primary font-bold text-lg">🍳 Chef Portal</p>
        <p>Discover and share chef-crafted recipes.</p>
      </div>
      <div className="flex gap-4">
        <Link to="/">About</Link>
        <Link to="/recipes">Recipes</Link>
        <Link to="/chefs">Chefs</Link>
      </div>
    </div>
  </footer>
)

export default Footer
