/* const API_URL = 'http://localhost:8000/api';

// export const login = async (credentials) => {
//   const response = await fetch(`${API_URL}/login`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     },
//     body: JSON.stringify(credentials),
//     credentials: 'include',
//   });

//   if (!response.ok) {
//     throw new Error('Login failed');
//   }

//   return await response.json();
// };

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return await response.json();
};

export const logout = async () => {
  const response = await fetch(`${API_URL}/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }
};

export const checkAuth = async () => {
  const response = await fetch(`${API_URL}/user`, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Not authenticated');
  }

  return await response.json();
}; */