import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)

  useEffect(() => {
    const raw = localStorage.getItem('auth.admin')
    if (raw) {
      try {
        setAdmin(JSON.parse(raw))
      } catch {
        localStorage.removeItem('auth.admin')
      }
    }
  }, [])

  const login = (adminResponse) => {
    setAdmin(adminResponse)
    localStorage.setItem('auth.admin', JSON.stringify(adminResponse))
  }

  const logout = () => {
    setAdmin(null)
    localStorage.removeItem('auth.admin')
  }

  const value = useMemo(() => ({ admin, login, logout }), [admin])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


