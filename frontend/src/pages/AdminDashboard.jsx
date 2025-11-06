import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../state/AuthContext.jsx'

function TabButton({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 14px',
      borderBottom: active ? '2px solid #646cff' : '2px solid transparent',
      background: 'transparent', cursor: 'pointer'
    }}>{children}</button>
  )
}

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('admins')

  useEffect(() => {
    if (!admin) navigate('/')
  }, [admin, navigate])

  return (
    <div style={{ maxWidth: 1100, margin: '5vh auto', textAlign: 'left' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Admin Dashboard</h2>
        <div>
          <span style={{ marginRight: 12 }}>{admin?.email}</span>
          <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
        </div>
      </header>

      <nav style={{ marginTop: 20, borderBottom: '1px solid #333' }}>
        <TabButton active={tab==='courses'} onClick={() => setTab('courses')}>Courses</TabButton>
        <TabButton active={tab==='students'} onClick={() => setTab('students')}>Students</TabButton>
        <TabButton active={tab==='instructors'} onClick={() => setTab('instructors')}>Instructors</TabButton>
        <TabButton active={tab==='admins'} onClick={() => setTab('admins')}>Admins</TabButton>
      </nav>

      <section style={{ marginTop: 20 }}>
        {tab === 'admins' && <AdminsTab />}
        {tab === 'courses' && <Placeholder title="Courses" />}
        {tab === 'students' && <Placeholder title="Students" />}
        {tab === 'instructors' && <Placeholder title="Instructors" />}
      </section>
    </div>
  )
}

function Placeholder({ title }) {
  return (
    <div>
      <h3>{title}</h3>
      <p>APIs not wired yet. Coming soon.</p>
    </div>
  )
}

function AdminsTab() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [deleteState, setDeleteState] = useState({ id: null, reason: '', open: false })
  const [editState, setEditState] = useState({ open: false, id: null, firstName: '', lastName: '', email: '', permissions: '' })

  const fetchAdmins = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.get('http://localhost:8080/api/admins')
      setList(res.data?.data || [])
    } catch (e) {
      setError('Failed to load admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAdmins() }, [])

  const createAdmin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await axios.post('http://localhost:8080/api/admins', {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        permissions: 'all'
      })
      setForm({ firstName: '', lastName: '', email: '', password: '' })
      fetchAdmins()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to create admin')
    }
  }

  const confirmDelete = (id) => setDeleteState({ id, reason: '', open: true })
  const cancelDelete = () => setDeleteState({ id: null, reason: '', open: false })
  const performDelete = async () => {
    if (!deleteState.id) return
    try {
      await axios.delete(`http://localhost:8080/api/admins/${deleteState.id}`, { data: { reason: deleteState.reason } })
      cancelDelete()
      fetchAdmins()
    } catch (e) {
      setError(e?.response?.data?.message || 'Failed to delete admin')
    }
  }

  return (
    <div>
      <h3>Admins</h3>
      {error && (
        <div style={{ background: '#ffefef', color: '#a10000', padding: '8px 12px', borderRadius: 6, marginBottom: 12 }}>
          {error}
        </div>
      )}
      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Name</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Email</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #333', padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.map(a => (
              <tr key={a.adminId}>
                <td style={{ padding: 8 }}>{a.firstName} {a.lastName}</td>
                <td style={{ padding: 8 }}>{a.email}</td>
                <td style={{ padding: 8 }}>
                  <button style={{ marginRight: 8 }} onClick={() => setEditState({ open: true, id: a.adminId, firstName: a.firstName || '', lastName: a.lastName || '', email: a.email || '', permissions: a.permissions || '' })}>Edit</button>
                  <button onClick={() => confirmDelete(a.adminId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #333' }}>
        <h4>Create Admin</h4>
        <form onSubmit={createAdmin} style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
          <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
          <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <div style={{ gridColumn: '1 / span 2' }}>
            <button type="submit">Create</button>
          </div>
        </form>
      </div>

      {deleteState.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8, width: 420 }}>
            <h4>Delete Admin</h4>
            <p>Please provide a reason for deletion.</p>
            <textarea value={deleteState.reason} onChange={(e) => setDeleteState({ ...deleteState, reason: e.target.value })} rows={3} style={{ width: '100%', margin: '8px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={cancelDelete}>Cancel</button>
              <button onClick={performDelete} disabled={!deleteState.reason.trim()}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {editState.open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#1a1a1a', padding: 20, borderRadius: 8, width: 520 }}>
            <h4>Edit Admin</h4>
            <div style={{ display: 'grid', gap: 10, gridTemplateColumns: '1fr 1fr' }}>
              <input placeholder="First name" value={editState.firstName} onChange={(e) => setEditState({ ...editState, firstName: e.target.value })} />
              <input placeholder="Last name" value={editState.lastName} onChange={(e) => setEditState({ ...editState, lastName: e.target.value })} />
              <input placeholder="Email" type="email" value={editState.email} onChange={(e) => setEditState({ ...editState, email: e.target.value })} style={{ gridColumn: '1 / span 2' }} />
              <input placeholder="Permissions (e.g., all,manage_users)" value={editState.permissions} onChange={(e) => setEditState({ ...editState, permissions: e.target.value })} style={{ gridColumn: '1 / span 2' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 12 }}>
              <button onClick={() => setEditState({ open: false, id: null, firstName: '', lastName: '', email: '', permissions: '' })}>Cancel</button>
              <button onClick={async () => {
                try {
                  await axios.put(`http://localhost:8080/api/admins/${editState.id}`, {
                    firstName: editState.firstName,
                    lastName: editState.lastName,
                    email: editState.email,
                    password: '',
                    permissions: editState.permissions || 'all'
                  })
                  setEditState({ open: false, id: null, firstName: '', lastName: '', email: '', permissions: '' })
                  fetchAdmins()
                } catch (e) {
                  setError(e?.response?.data?.message || 'Failed to update admin')
                }
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


