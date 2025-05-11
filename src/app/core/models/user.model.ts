export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}
