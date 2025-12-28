import api from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const login = (credentials: LoginCredentials) => {
  return api.post("/auth/login", credentials);
};

export const register = (data: RegisterData) => {
  return api.post("/auth/register", data);
};
