import { useState } from 'react'
import axios from 'axios'

export default function StudentSignUp() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [message, setMessage] = useState('')

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    try {
      const res = await axios.post('/api/auth/student/signup', form)
      setMessage(res.data.message || 'Signup successful')
    } catch (err) {
      const msg = err?.response?.data?.message || 'Signup failed'
      setMessage(msg)
      alert(msg)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '40px auto' }}>
      <h2>Student Sign Up</h2>
      <form onSubmit={onSubmit}>
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={onChange} required />
        <br />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={onChange} required />
        <br />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={onChange} required />
        <br />
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}


