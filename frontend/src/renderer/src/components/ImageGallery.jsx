import React, { useState, useEffect } from 'react'
import { PhotoEditor } from 'react-photo-editor'
//import 'react-photo-editor/dist/style.css' // Import the CSS

const ImageGallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [appPath, setAppPath] = useState('')
  const [viewingImage, setViewingImage] = useState(null)

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.getAppPath) {
      window.electronAPI.getAppPath().then((path) => {
        setAppPath(path)
      })
    }
  }, [])

  const loadImages = async () => {
    if (!window.electronAPI) return
    const images = await window.electronAPI.loadImages()
    setImages(images)
  }

  const handleDelete = async (fileName) => {
    if (!window.electronAPI) return
    await window.electronAPI.deleteImage(fileName)
    loadImages()
  }

  const handleSaveEditedImage = async (editedImageBlob) => {
    if (!window.electronAPI) return

    try {
      // Convert Blob to ArrayBuffer
      const arrayBuffer = await new Response(editedImageBlob).arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      await window.electronAPI.saveImage({
        fileName: `edited-${Date.now()}.png`,
        buffer: uint8Array
      })

      loadImages()
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  return (
    <div className="gallery">
      <h2>Image Gallery</h2>
      <div className="grid">
        {images.map((img, index) => (
          <div key={index} className="thumbnail">
            <img
              src={`app://${img.path}`}
              alt={img.name}
              onError={(e) => {
                console.error('Image load failed:', {
                  src: e.target.src,
                  storedPath: img.path,
                  calculatedPath: appPath ? `${appPath}/${img.path}` : 'Unknown'
                })
              }}
            />
            <div className="controls">
              <button onClick={() => setSelectedImage(img)} className="btn">
                Edit
              </button>
              <button onClick={() => setViewingImage(img)} className="btn view-btn">
                View
              </button>
              {viewingImage && (
                <div className="view-modal" onClick={() => setViewingImage(null)}>
                  <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="close-btn" onClick={() => setViewingImage(null)}>
                      &times;
                    </button>
                    <img
                      src={`app://${viewingImage.path}`}
                      alt={viewingImage.name}
                      className="image-viewed"
                    />
                    <div className="image-info">
                      <p>Name: {viewingImage.name}</p>
                    </div>
                  </div>
                </div>
              )}
              <button onClick={() => handleDelete(img.name)} className="btn delete-btn">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="edit-modal">
          <PhotoEditor
            image={`app://${selectedImage.path}`}
            onSave={(editedImage) => {
              handleSaveEditedImage(editedImage)
              setSelectedImage(null)
            }}
            onClose={() => setSelectedImage(null)}
            tools={[
              'crop',
              'rotate',
              'brightness',
              'contrast',
              'saturation',
              'filter',
              'text',
              'draw',
              'resize'
            ]}
            defaultTool="crop"
            hideHeader
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#f5f5f5'
            }}
          />
        </div>
      )}
    </div>
  )
}

export default ImageGallery
