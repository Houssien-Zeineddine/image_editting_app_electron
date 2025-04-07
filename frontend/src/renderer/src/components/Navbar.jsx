import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Image Manager</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/" className="navbar-item">
              Gallery
            </Link>
            <Link to="/upload" className="navbar-item">
              Upload
            </Link>
            <button onClick={handleLogout} className="navbar-item">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-item">
              Login
            </Link>
            <Link to="/register" className="navbar-item">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
