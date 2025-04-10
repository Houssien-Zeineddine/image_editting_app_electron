import React, { useState, useEffect, useRef, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getImage, updateImage } from '../services/images'
import { AuthContext } from '../context/AuthContext'

const ImageEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(AuthContext)
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [edits, setEdits] = useState({
    rotate: 0,
    grayscale: false,
    watermark: '',
    crop: { x: 0, y: 0, width: 100, height: 100 }
  })
  const canvasRef = useRef(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const data = await getImage(id)
        if (data.user_id !== user.id) {
          navigate('/')
          return
        }
        setImage(data)
      } catch (err) {
        setError('Failed to fetch image')
      } finally {
        setLoading(false)
      }
    }
    fetchImage()
  }, [id, user.id, navigate])

  useEffect(() => {
    if (image && canvasRef.current) {
      applyEdits()
    }
  }, [image, edits])

  const applyEdits = () => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      // Apply rotation
      ctx.save()
      ctx.translate(canvas.width / 2, canvas.height / 2)
      ctx.rotate((edits.rotate * Math.PI) / 180)

      // Apply grayscale
      if (edits.grayscale) {
        ctx.filter = 'grayscale(100%)'
      } else {
        ctx.filter = 'none'
      }

      // Draw the image
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)

      // Apply watermark
      if (edits.watermark) {
        ctx.font = '30px Arial'
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
        ctx.textAlign = 'center'
        ctx.fillText(edits.watermark, 0, 0)
      }

      ctx.restore()
    }

    img.src = `http://localhost:8000/storage/${image.path}`
  }

  const handleRotate = (degrees) => {
    setEdits({ ...edits, rotate: edits.rotate + degrees })
  }

  const handleGrayscale = () => {
    setEdits({ ...edits, grayscale: !edits.grayscale })
  }

  const handleWatermarkChange = (e) => {
    setEdits({ ...edits, watermark: e.target.value })
  }

  const handleSave = async () => {
    try {
      const canvas = canvasRef.current
      canvas.toBlob(
        async (blob) => {
          const formData = new FormData()
          formData.append('image', blob, image.name)
          formData.append('edits', JSON.stringify(edits))

          await updateImage(image.id, formData)
          alert('Image saved successfully!')
          navigate('/')
        },
        'image/jpeg',
        0.9
      )
    } catch (err) {
      setError('Failed to save image')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="error">{error}</div>
  if (!image) return <div>Image not found</div>

  return (
    <div className="image-editor">
      <h2>Edit Image</h2>
      <div className="editor-container">
        <div className="canvas-container">
          <canvas ref={canvasRef} />
        </div>
        <div className="editor-controls">
          <div className="control-group">
            <h3>Rotation</h3>
            <button onClick={() => handleRotate(90)} className="btn">
              Rotate 90°
            </button>
            <button onClick={() => handleRotate(-90)} className="btn">
              Rotate -90°
            </button>
          </div>
          <div className="control-group">
            <h3>Filters</h3>
            <button onClick={handleGrayscale} className={`btn ${edits.grayscale ? 'active' : ''}`}>
              Grayscale {edits.grayscale ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="control-group">
            <h3>Watermark</h3>
            <input
              type="text"
              value={edits.watermark}
              onChange={handleWatermarkChange}
              placeholder="Enter watermark text"
            />
          </div>
          <div className="control-group">
            <button onClick={handleSave} className="btn primary">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageEditor
