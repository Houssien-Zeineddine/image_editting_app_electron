import React, { useState, useEffect } from 'react'
import * as fabric from 'fabric'
import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
//import { ipcRenderer } from 'electron'

const ImageGallery = () => {
  const [images, setImages] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [crop, setCrop] = useState({ aspect: 1 })
  const [canvas, setCanvas] = useState(null)
  const [editMode, setEditMode] = useState('crop')
  const [appPath, setAppPath] = useState('')

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

  // useEffect(() => {
  //   ipcRenderer.invoke('get-app-path').then(setAppPath)
  // }, [])

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

  const initializeCanvas = (imgElement) => {
    const newCanvas = new fabric.Canvas('edit-canvas', {
      width: imgElement.width,
      height: imgElement.height
    })
    newCanvas.add(new fabric.Image(imgElement))
    setCanvas(newCanvas)
  }

  const handleCrop = async () => {
    const croppedImage = await getCroppedImg(selectedImage, crop)
    const img = new Image()
    img.src = croppedImage
    img.onload = () => initializeCanvas(img)
  }

  const applyFilter = (filterType) => {
    if (!canvas) return

    switch (filterType) {
      case 'grayscale':
        canvas.getActiveObject().filters.push(new fabric.Image.filters.Grayscale())
        break
      case 'rotate':
        canvas.getActiveObject().rotate(90)
        break
    }
    canvas.renderAll()
  }

  const saveEditedImage = async () => {
    if (!window.electronAPI || !canvas) return

    try {
      const dataUrl = canvas.toDataURL()
      // Convert base64 to Uint8Array without Node.js Buffer
      const byteString = atob(dataUrl.split(',')[1])
      const arrayBuffer = new ArrayBuffer(byteString.length)
      const uint8Array = new Uint8Array(arrayBuffer)

      for (let i = 0; i < byteString.length; i++) {
        uint8Array[i] = byteString.charCodeAt(i)
      }

      await window.electronAPI.saveImage({
        fileName: `edited-${Date.now()}.png`,
        buffer: uint8Array
      })

      loadImages()
      setSelectedImage(null)
    } catch (error) {
      console.error('Save failed:', error)
    }
  }

  return (
    <div className="gallery">
      <h2>Image Gallery</h2>
      <div className="grid">
        {images.map((img, index) => (
          //console.log('Image URL from imagegallery component:', `app:///${img.path}`),
          <div key={index} className="thumbnail">
            <img
              src={`app://${img.path}`} // Changed from app:/// to app://
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
              <button onClick={() => setSelectedImage(img)}>Edit</button>
              <button onClick={() => handleDelete(img.name)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div className="edit-modal">
          <div className="edit-tools">
            <button onClick={() => setEditMode('crop')}>Crop</button>
            <button onClick={() => applyFilter('grayscale')}>B&W</button>
            <button onClick={() => applyFilter('rotate')}>Rotate</button>
            <button onClick={saveEditedImage}>Save</button>
            <button onClick={() => setSelectedImage(null)}>Cancel</button>
          </div>

          {editMode === 'crop' ? (
            <ReactCrop
              src={`app:///${selectedImage.path}`}
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onImageLoaded={handleCrop}
            />
          ) : (
            <canvas id="edit-canvas" />
          )}
        </div>
      )}
    </div>
  )
}

const getCroppedImg = (image, crop) => {
  const canvas = document.createElement('canvas')
  const img = new Image()
  img.src = `app://${image.path}`

  return new Promise((resolve) => {
    img.onload = () => {
      const scaleX = img.naturalWidth / img.width
      const scaleY = img.naturalHeight / img.height

      canvas.width = crop.width * scaleX
      canvas.height = crop.height * scaleY

      const ctx = canvas.getContext('2d')
      ctx.drawImage(
        img,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        canvas.width,
        canvas.height
      )

      resolve(canvas.toDataURL())
    }
  })
}

export default ImageGallery
