import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/axios-client";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
}

type AuthUserResponse = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
};

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

export const useUpdateProfileMutation = () => {
  const { setSession, accessToken, user } = useAuth();

  return useMutation({
    mutationFn: async ({ name, phone }: { name: string; phone?: string }) => {
      try {
        const response = await api.patch<{
          success: boolean;
          message?: string;
          user: AuthUserResponse;
        }>("/users/profile", { name, phone });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const apiError = error as AxiosError<ApiErrorResponse>;
          throw new Error(
            apiError.response?.data?.message ||
              "Failed to update profile. Please try again.",
          );
        }

        throw error;
      }
    },
    onSuccess: (data) => {
      if (accessToken && user && data?.user) {
        setSession({
          accessToken,
          user: {
            ...user,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            role: data.user.role,
          },
        });
      }

      toast.success(data?.message || "Profile updated successfully.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update profile.");
    },
  });
};

export const useChangePasswordMutation = () => {
  const { logout } = useAuth();
  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      try {
        const response = await api.patch("/users/change-password", {
          currentPassword,
          newPassword,
        });
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          const apiError = error as AxiosError<ApiErrorResponse>;
          throw new Error(
            apiError.response?.data?.message ||
              "Failed to change password. Please try again.",
          );
        }

        throw error;
      }
    },
    onSuccess: (data: { message?: string }) => {
      toast.success(data?.message || "Password changed successfully.");
      logout();
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to change password.");
    },
  });
};
