const API_URL = 'http://localhost:8000/api';

export const getImages = async (userId) => {
  const response = await fetch(`${API_URL}/images?user_id=${userId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch images');
  }

  return await response.json();
};

export const getImage = async (id) => {
  const response = await fetch(`${API_URL}/images/${id}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch image');
  }

  return await response.json();
};

export const uploadImage = async (formData) => {
  const response = await fetch(`${API_URL}/images`, {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to upload image');
  }

  return await response.json();
};

export const updateImage = async (id, formData) => {
  const response = await fetch(`${API_URL}/images/${id}`, {
    method: 'PUT',
    body: formData,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to update image');
  }

  return await response.json();
};

export const deleteImage = async (id) => {
  const response = await fetch(`${API_URL}/images/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to delete image');
  }
};