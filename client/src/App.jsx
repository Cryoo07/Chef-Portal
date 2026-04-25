import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { toast } from 'react-toastify'
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
import ChefAnalyticsPage from './pages/ChefAnalyticsPage.jsx'
import AdminAnalyticsPage from './pages/AdminAnalyticsPage.jsx'
import ChefProfileSettingsPage from './pages/ChefProfileSettingsPage.jsx'
import AdminUsersPage from './pages/AdminUsersPage.jsx'
import AdminRecipesPage from './pages/AdminRecipesPage.jsx'
import AdminChefApplicationsPage from './pages/AdminChefApplicationsPage.jsx'
import ChefRecipesPage from './pages/ChefRecipesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const Protected = ({ roles, requiresChefApproval = false, children, redirectTo = '/' }) => {
  const { user } = useAuth()
  if (!user) {
    toast.error('Please login first')
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(user.role)) {
    toast.error('You are not allowed to access this page')
    return <Navigate to={redirectTo} replace />
  }
  if (requiresChefApproval && user.role === 'chef' && (!user.isApproved || user.chefVerification?.status !== 'approved')) {
    toast.warning('Chef account approval is required for this page')
    return <Navigate to="/chef/dashboard" replace />
  }
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
      <Route path="/saved" element={<Protected roles={['user', 'chef']}><UserDashboardPage /></Protected>} />
      <Route path="/profile" element={<Protected roles={['user', 'chef']}><UserDashboardPage /></Protected>} />
      <Route path="/chef/dashboard" element={<Protected roles={['chef']}><ChefDashboardPage /></Protected>} />
      <Route path="/chef/recipes" element={<Protected roles={['chef']}><ChefRecipesPage /></Protected>} />
      <Route path="/chef/analytics" element={<Protected roles={['chef']} requiresChefApproval><ChefAnalyticsPage /></Protected>} />
      <Route path="/chef/profile" element={<Protected roles={['chef']}><ChefProfileSettingsPage /></Protected>} />
      <Route path="/chef/recipes/new" element={<Protected roles={['chef']} requiresChefApproval><RecipeEditorPage /></Protected>} />
      <Route path="/chef/recipes/:id/edit" element={<Protected roles={['chef']} requiresChefApproval><RecipeEditorPage /></Protected>} />
      <Route path="/admin" element={<Protected roles={['admin']}><AdminDashboardPage /></Protected>} />
      <Route path="/admin/chef-applications" element={<Protected roles={['admin']}><AdminChefApplicationsPage /></Protected>} />
      <Route path="/admin/recipes" element={<Protected roles={['admin']}><AdminRecipesPage /></Protected>} />
      <Route path="/admin/users" element={<Protected roles={['admin']}><AdminUsersPage /></Protected>} />
      <Route path="/admin/analytics" element={<Protected roles={['admin']}><AdminAnalyticsPage /></Protected>} />
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
