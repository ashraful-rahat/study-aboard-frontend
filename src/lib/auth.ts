export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch('http://localhost:5000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    
    // Store token in localStorage
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    
    return data.data;
  } catch (error) {
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};
