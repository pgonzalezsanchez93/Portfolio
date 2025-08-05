export interface User {
  id?: string;
  name: string;
  email: string;
  password?: string;
  token?: string;  // Token stored with user
  id_user?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  success: boolean;
  message?: string;
}

export interface LoginData {
  email: string;
  password: string;
  isAdmin?: boolean;  // This is used to determine which token endpoint to use
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Response from server when getting a token
export interface TokenResponse {
  status: number;
  errorMsg: string;
  result: {
    token: string;
  };
}

// Response from server when verifying a token
export interface VerifyTokenResponse {
  status: number;
  errorMsg: string;
  result: {
    userLogin: {
      rol: number;  // 1 for admin, 2 for normal user
      name: string;
      id_user: number;
    }
  };
}

// Simplified response for frontend
export interface VerifyResponse {
  role: number; // 1 for admin, 2 for normal user
  valid: boolean;
  userName?: string;
  userId?: number;
}
