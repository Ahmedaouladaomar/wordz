import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userQueryKeys, userService } from "../services/userService";

/**
 * Hook to fetch user profile data
 */
export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userQueryKeys.profile(userId),
    queryFn: () => userService.getUser(userId),
    enabled: !!userId, // Only run query if userId exists
  });
}

/**
 * Hook to update user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: any }) =>
      userService.updateUser(userId, data),
    onSuccess: (data, variables) => {
      // Invalidate and refetch user profile data
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.profile(variables.userId),
      });
    },
  });
}

/**
 * Hook to delete user
 */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => userService.deleteUser(userId),
    onSuccess: (data, userId) => {
      // Invalidate user queries
      queryClient.invalidateQueries({
        queryKey: userQueryKeys.all,
      });
    },
  });
}
