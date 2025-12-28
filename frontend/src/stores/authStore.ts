import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notifications } from "@mantine/notifications";
import {
  login as loginService,
  register as registerService,
} from "../services/auth";
import type { LoginCredentials, RegisterData } from "../services/auth";
import type { User } from "../types/user";

interface AuthState {
  token: string | null;
  user: User | null;
  userIsLoggedIn: () => boolean;
  userData: () => User | null;
  login: (credentials: LoginCredentials) => Promise<unknown>;
  register: (data: RegisterData) => Promise<unknown>;
  logout: () => void;
  clearUserCookies: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,

      userIsLoggedIn: () => !!get().token,
      userData: () => get().user,

      login: async (credentials: LoginCredentials) => {
        try {
          const response = await loginService(credentials);

          const data = response?.data.data;

          if (data?.token) {
            set({
              token: data.token,
              user: data.user,
            });
            notifications.show({
              title: "Success",
              message: "Login successful!",
              color: "green",
            });
          }
          return data;
        } catch (err: unknown) {
          const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Login failed. Please try again.";
          notifications.show({
            title: "Error",
            message: errorMessage,
            color: "red",
          });
          throw err;
        }
      },

      register: async (registerData: RegisterData) => {
        try {
          const response = await registerService(registerData);

          const data = response?.data.data;

          if (data) {
            set({
              token: data.token,
              user: data.user,
            });
            notifications.show({
              title: "Success",
              message: "Registration successful!",
              color: "green",
            });
          }
          return data;
        } catch (err: unknown) {
          const errorMessage =
            (err as { response?: { data?: { message?: string } } })?.response
              ?.data?.message || "Registration failed. Please try again.";
          notifications.show({
            title: "Error",
            message: errorMessage,
            color: "red",
          });
          throw err;
        }
      },

      logout: () => {
        set({ token: null, user: null });
      },

      clearUserCookies: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
