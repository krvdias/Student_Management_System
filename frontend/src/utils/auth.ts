export const setAuthToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem('refreshToken', refreshToken);
};

export const setUserName = (username: string) => {
  localStorage.setItem('username', username);
}

export const setUserId = (userId: string) => {
  localStorage.setItem('userId', userId);
}

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken');
};

export const getUserName = () => {
  return localStorage.getItem('username');
}

export const getUserId = () => {
  return localStorage.getItem('userId');
}

export const removeAuthToken = () => {
  localStorage.removeItem('token');
};