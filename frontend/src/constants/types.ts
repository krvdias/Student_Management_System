export interface LoginData {
  username: string;
  password: string;
}

export interface refreshTokenData {
    refreshToken: string
}

export interface LogoutData {
    id: number;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface eventData {
    title: string;
    coordinator: string;
    eventDate: string;
}