// Auth utility functions
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};

export const setUser = (user, role) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('userRole', role);
};

export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

export const removeUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
};

// Legacy functions for backward compatibility
export const setUniversity = (university) => {
  setUser(university, 'university');
};

export const getUniversity = () => {
  const role = getUserRole();
  return role === 'university' ? getUser() : null;
};

export const removeUniversity = () => {
  removeUser();
};

export const setAdmin = (admin) => {
  setUser(admin, 'admin');
};

export const getAdmin = () => {
  const role = getUserRole();
  return role === 'admin' ? getUser() : null;
};

export const setAgency = (agency) => {
  setUser(agency, 'agency');
};

export const getAgency = () => {
  const role = getUserRole();
  return role === 'agency' ? getUser() : null;
};

export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getUser();
  const role = getUserRole();
  return !!(token && user && role);
};

export const logout = () => {
  const role = getUserRole();
  removeAuthToken();
  removeUser();
  
  // Redirect based on role
  switch (role) {
    case 'admin':
      window.location.href = '/admin/login';
      break;
    case 'agency':
      window.location.href = '/agency/login';
      break;
    case 'university':
    default:
      window.location.href = '/university/login';
      break;
  }
};

// Token expiration check
export const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};
