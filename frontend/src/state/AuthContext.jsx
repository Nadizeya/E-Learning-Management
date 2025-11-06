import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [student, setStudent] = useState(null)

  useEffect(() => {
    const adminRaw = localStorage.getItem('auth.admin')
    if (adminRaw) {
      try {
        setAdmin(JSON.parse(adminRaw))
      } catch {
        localStorage.removeItem('auth.admin')
      }
    }

    const studentRaw = localStorage.getItem('auth.student')
    if (studentRaw) {
      try {
        setStudent(JSON.parse(studentRaw))
      } catch {
        localStorage.removeItem('auth.student')
      }
    }
  }, [])

  const login = (adminResponse) => {
    setAdmin(adminResponse)
    localStorage.setItem('auth.admin', JSON.stringify(adminResponse))
  }

  const loginStudent = (studentResponse) => {
    setStudent(studentResponse)
    localStorage.setItem('auth.student', JSON.stringify(studentResponse))
  }

  const logout = () => {
    setAdmin(null)
    setStudent(null)
    localStorage.removeItem('auth.admin')
    localStorage.removeItem('auth.student')
  }

  const value = useMemo(() => ({ admin, student, login, loginStudent, logout }), [admin, student])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


