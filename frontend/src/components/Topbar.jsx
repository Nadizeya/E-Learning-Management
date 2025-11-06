import React from 'react'
export default function Topbar({ title, adminEmail }) {
  const [open, setOpen] = React.useState(false)

  const handleMouseEnter = () => setOpen(true)
  const handleMouseLeave = () => setOpen(false)

  const changeAccount = () => {
    // Signal to page via custom event so parent can handle navigation/logout
    document.dispatchEvent(new CustomEvent('topbar:changeAccount'))
  }
  const logout = () => {
    document.dispatchEvent(new CustomEvent('topbar:logout'))
  }

  return (
    <nav className="navbar navbar-expand bg-white border-bottom px-3" role="navigation">
      <div className="container-fluid position-relative">
        <span className="position-absolute top-50 start-50 translate-middle text-info fw-bold fs-3">{title}</span>
        <div className="ms-auto position-relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ cursor: 'pointer' }}>
          <div className="d-flex align-items-center">
            <span className="me-2 small text-secondary d-none d-md-inline">{adminEmail}</span>
            <i className="bi bi-person-circle fs-4 text-info"></i>
          </div>
          <ul className={`dropdown-menu dropdown-menu-end ${open ? 'show' : ''}`} style={{ right: 0 }}>
            <li><button className="dropdown-item" onClick={changeAccount}><i className="bi bi-arrow-repeat me-2"></i>Change account</button></li>
            <li><button className="dropdown-item text-danger" onClick={logout}><i className="bi bi-box-arrow-right me-2"></i>Log out</button></li>
          </ul>
        </div>
      </div>
    </nav>
  )
}

