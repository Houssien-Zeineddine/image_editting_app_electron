import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import axiosBaseUrl from './utils/axios'

const Navbar = () => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = async () => {
    console.log('logout')
    // const token = localStorage.getItem('access_token')
    const response = await axiosBaseUrl.post('/user/logout', {})
    localStorage.removeItem('access_token')
    setUser(null)
    console.log('logout:' + response.data)
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/imagegallery">Image Manager</Link>
      </div>
      <div className="navbar-menu">
        {user ? (
          <>
            <Link to="/imagegallery" className="navbar-item">
              Gallery
            </Link>
            <Link to="/upload" className="navbar-item">
              Upload
            </Link>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="navbar-item">
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
