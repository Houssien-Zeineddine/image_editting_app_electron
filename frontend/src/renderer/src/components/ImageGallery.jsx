import React, { useState, useEffect, useContext } from 'react'
import { getImages, deleteImage } from './services/images'
import { Link } from 'react-router-dom'
import { AuthContext } from './context/AuthContext'
import axios from 'axios'

const ImageGallery = () => {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v0.1/guest/login')
        setImages(response.data.images)
      } catch (err) {
        setError('Failed to fetch images')
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [user.id])

  const handleDelete = async (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteImage(imageId)
        setImages(images.filter((image) => image.id !== imageId))
      } catch (err) {
        setError('Failed to delete image')
      }
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="image-gallery">
      <h2>Your Images</h2>
      <Link to="/upload" className="btn">
        Upload New Image
      </Link>
      <div className="gallery-grid">
        {images.length === 0 ? (
          <p>No images found. Upload your first image!</p>
        ) : (
          images.map((image) => (
            <div key={image.id} className="gallery-item">
              <img src={`http://localhost:8000/storage/${image.path}`} alt={image.name} />
              <div className="image-actions">
                <Link to={`/edit/${image.id}`} className="btn">
                  Edit
                </Link>
                <button onClick={() => handleDelete(image.id)} className="btn danger">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ImageGallery
