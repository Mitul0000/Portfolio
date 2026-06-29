import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './utils/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyOtp from './pages/VerifyOtp'
import ForgotPassword from './pages/ForgotPassword'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Tools from './pages/Tools'
import ToolRequest from './pages/ToolRequest'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
          
          <Route path="/blogs/:blogId" element={<BlogDetail />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/about" element={<About />} />
          <Route path="/tool-request" element={
            <ProtectedRoute><ToolRequest /></ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="*" element={
            <div className="text-center py-32 text-gray-400">
              <h2 className="text-3xl font-bold text-white mb-3">404</h2>
              <p>Page not found.</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
