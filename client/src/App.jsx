import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import RecipesPage from './pages/RecipesPage.jsx'
import RecipeDetailPage from './pages/RecipeDetailPage.jsx'
import ChefsPage from './pages/ChefsPage.jsx'
import ChefProfilePage from './pages/ChefProfilePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import UserDashboardPage from './pages/UserDashboardPage.jsx'
import ChefDashboardPage from './pages/ChefDashboardPage.jsx'
import RecipeEditorPage from './pages/RecipeEditorPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const Protected = ({ roles, children }) => {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

const AppRoutes = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      <Route path="/chefs" element={<ChefsPage />} />
      <Route path="/chefs/:id" element={<ChefProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<Protected roles={['user']}><UserDashboardPage /></Protected>} />
      <Route path="/chef/dashboard" element={<Protected roles={['chef']}><ChefDashboardPage /></Protected>} />
      <Route path="/chef/recipes/new" element={<Protected roles={['chef']}><RecipeEditorPage /></Protected>} />
      <Route path="/chef/recipes/:id/edit" element={<Protected roles={['chef']}><RecipeEditorPage /></Protected>} />
      <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboardPage /></Protected>} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  </Routes>
)

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" />
    </BrowserRouter>
  </AuthProvider>
)

export default App
