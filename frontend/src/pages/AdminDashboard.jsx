import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../state/AuthContext.jsx'
import Sidebar from '../components/Sidebar.jsx'
import Topbar from '../components/Topbar.jsx'

export default function AdminDashboard() {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('admins')

  useEffect(() => {
    if (!admin) navigate('/')
  }, [admin, navigate])

  useEffect(() => {
    const onLogout = () => { logout(); navigate('/') }
    const onChange = () => { logout(); navigate('/') }
    document.addEventListener('topbar:logout', onLogout)
    document.addEventListener('topbar:changeAccount', onChange)
    return () => {
      document.removeEventListener('topbar:logout', onLogout)
      document.removeEventListener('topbar:changeAccount', onChange)
    }
  }, [logout, navigate])

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f6fbfd' }}>
      <Sidebar active={tab} onSelect={setTab} />
      <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
        <Topbar title="E‑Learning Management System" adminEmail={admin?.email || ''} />

        <div className="detail-container container-fluid p-5">

          {tab === 'admins' && <AdminsTab />}
          {tab === 'courses' && <Placeholder title="Courses" />}
          {tab === 'students' && <Placeholder title="Student Detail" />}
          {tab === 'instructors' && <Placeholder title="Instructor Detail" />}
          {tab === 'enrollment' && <Placeholder title="Enrollment" />}
        </div>
      </div>
    </div>
  )
}

function Placeholder({ title }) {
  return (
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <h5 className="card-title text-info">{title}</h5>
        <p className="card-text text-secondary mb-0">APIs not wired yet. Coming soon.</p>
      </div>
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
    <div className="card shadow-sm w-100">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title m-0 text-info">Admins</h5>
        </div>
        {error && (
          <div className="alert alert-danger" role="alert">{error}</div>
        )}
        {loading ? <p>Loading...</p> : (
          <div className="table-responsive">
            <table className="table align-middle w-100">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col" className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(a => (
                  <tr key={a.adminId}>
                    <td>{a.firstName} {a.lastName}</td>
                    <td>{a.email}</td>
                    <td className="text-end">
                      <button className="btn btn-sm btn-outline-info me-2" onClick={() => setEditState({ open: true, id: a.adminId, firstName: a.firstName || '', lastName: a.lastName || '', email: a.email || '', permissions: a.permissions || '' })}><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => confirmDelete(a.adminId)}><i className="bi bi-trash"></i></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-3 pt-3 border-top">
          <h6 className="text-info">Create Admin</h6>
          <form onSubmit={createAdmin} className="row g-2">
            <div className="col-md-6">
              <input className="form-control" placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="col-md-6">
              <input className="form-control" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-info text-white">Create</button>
            </div>
          </form>
        </div>

        {deleteState.open && (
          <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Delete Admin</h5>
                  <button type="button" className="btn-close" onClick={cancelDelete}></button>
                </div>
                <div className="modal-body">
                  <p>Please provide a reason for deletion.</p>
                  <textarea className="form-control" value={deleteState.reason} onChange={(e) => setDeleteState({ ...deleteState, reason: e.target.value })} rows={3} />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                  <button className="btn btn-danger" onClick={performDelete} disabled={!deleteState.reason.trim()}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {editState.open && (
          <div className="modal d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.6)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Admin</h5>
                  <button type="button" className="btn-close" onClick={() => setEditState({ open: false, id: null, firstName: '', lastName: '', email: '', permissions: '' })}></button>
                </div>
                <div className="modal-body">
                  <div className="row g-2">
                    <div className="col-md-6">
                      <input className="form-control" placeholder="First name" value={editState.firstName} onChange={(e) => setEditState({ ...editState, firstName: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <input className="form-control" placeholder="Last name" value={editState.lastName} onChange={(e) => setEditState({ ...editState, lastName: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <input className="form-control" placeholder="Email" type="email" value={editState.email} onChange={(e) => setEditState({ ...editState, email: e.target.value })} />
                    </div>
                    <div className="col-12">
                      <input className="form-control" placeholder="Permissions (e.g., all,manage_users)" value={editState.permissions} onChange={(e) => setEditState({ ...editState, permissions: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setEditState({ open: false, id: null, firstName: '', lastName: '', email: '', permissions: '' })}>Cancel</button>
                  <button className="btn btn-info text-white" onClick={async () => {
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
          </div>
        )}
      </div>
    </div>
  )
}

