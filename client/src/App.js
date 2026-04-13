import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/admin/Dashboard'
import ManageChefs from './pages/admin/ManageChefs'
import ManageRecipes from './pages/admin/ManageRecipes'
import ChefDashboard from './pages/chef/Dashboard'
import AddRecipe from './pages/chef/AddRecipe'
import MyRecipes from './pages/chef/MyRecipes'
import Browse from './pages/foodlover/Browse'
import RecipeDetail from './pages/foodlover/RecipeDetail'

const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

const HomeRedirect = () => {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  if (user.role === 'chef') return <Navigate to="/chef" replace />
  return <Navigate to="/browse" replace />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/chefs"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ManageChefs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recipes"
              element={
                <ProtectedRoute roles={['admin']}>
                  <ManageRecipes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef"
              element={
                <ProtectedRoute roles={['chef']}>
                  <ChefDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef/add"
              element={
                <ProtectedRoute roles={['chef']}>
                  <AddRecipe />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chef/my"
              element={
                <ProtectedRoute roles={['chef']}>
                  <MyRecipes />
                </ProtectedRoute>
              }
            />
            <Route path="/browse" element={<ProtectedRoute roles={['foodlover']}><Browse /></ProtectedRoute>} />
            <Route path="/recipe/:id" element={<ProtectedRoute roles={['foodlover', 'chef', 'admin']}><RecipeDetail /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
