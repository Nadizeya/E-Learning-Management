import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../state/AuthContext.jsx'
import './AdminLogin.css'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await axios.post('http://localhost:8080/api/admins/auth/login', { email, password })
      const token = res.data?.token
      const admin = res.data?.admin
      if (!token || !admin) throw new Error('Invalid response')
      login(admin, token)
      navigate('/admin')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-card shadow-sm">
        <h2 className="brand">E‑Learning Management System</h2>
        <h3 className="title">Admin Sign in</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="login-form">
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
      </div>
    </div>
  )
}


