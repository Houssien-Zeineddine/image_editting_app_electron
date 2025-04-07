import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './components/context/AuthContext'
import Navbar from './components/Navbar'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import ImageGallery from './components/ImageGallery'
import ImageUpload from './components/ImageUpload'
import PrivateRoute from './components/PrivateRoute'
import './style.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ImageGallery />} />
              <Route path="/upload" element={<ImageUpload />} />
              {/* <Route
                path="/"
                element={
                  <PrivateRoute>
                    <ImageGallery />
                  </PrivateRoute>
                }
              />
              <Route
                path="/upload"
                element={
                  <PrivateRoute>
                    <ImageUpload />
                  </PrivateRoute>
                }
              /> */}
            </Routes>
          </div>
        </div>
      </AuthProvider>
    </Router>
  )
}
export default App
