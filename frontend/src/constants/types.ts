export interface LoginData {
  username: string;
  password: string;
}

export interface refreshTokenData {
    refreshToken: string
}

export interface LogoutData {
    id: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface eventData {
    id: number;
    title: string;
    coordinator: string;
    event_date: string;
    createdAt: string;
    updatedAt: string;
}

export interface EventData {
    title: string;
    coordinator: string;
    event_date: string;
}