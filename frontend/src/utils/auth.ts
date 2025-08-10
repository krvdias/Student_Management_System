export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};