import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
}

export const useLoginMutation = () => {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const apiError = error as AxiosError<ApiErrorResponse>;
          throw new Error(
            apiError.response?.data?.message ||
              "An error occurred during login",
          );
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, user: data.user });
    },
  });
};

export const useSignupMutation = () => {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: async ({
      name,
      email,
      password,
    }: {
      name: string;
      email: string;
      password: string;
    }) => {
      try {
        const response = await api.post("/auth/register", {
          name,
          email,
          password,
        });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const apiError = error as AxiosError<ApiErrorResponse>;
          throw new Error(
            apiError.response?.data?.message ||
              "An error occurred during registration",
          );
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.accessToken && data.user) {
        setSession({ accessToken: data.accessToken, user: data.user });
      }
    },
  });
};

export const useLogoutMutation = () => {
  const { logout } = useAuth();

  return useMutation({
    mutationFn: async () => {
      try {
        const response = await api.post("/auth/logout");
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const apiError = error as AxiosError<ApiErrorResponse>;
          throw new Error(
            apiError.response?.data?.message ||
              "An error occurred during logout",
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      logout();
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred during logout");
    },
  });
};
