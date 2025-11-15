import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const add = (message, options = {}) => {
    const id = Date.now() + Math.random()
    const duration = options.duration ?? 1800
    setToasts((prev) => [...prev, { id, message }])
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
    return id
  }

  const remove = (id) => setToasts((prev) => prev.filter((t) => t.id !== id))

  const value = useMemo(() => ({ add, remove }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', right: 16, bottom: 16, zIndex: 9999 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              background: '#16a34a',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 8,
              boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
              fontWeight: 600,
              marginTop: 8,
              minWidth: 220,
            }}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
