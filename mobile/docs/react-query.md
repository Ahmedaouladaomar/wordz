# React Query Setup

This app uses TanStack Query (React Query) v5 for efficient data fetching, caching, and state management.

## Configuration

The React Query client is configured in `lib/react-query.ts` with the following settings:

- **Stale Time**: 5 minutes (data is considered fresh for 5 minutes)
- **Cache Time**: 10 minutes (data stays in cache for 10 minutes)
- **Retry Logic**: 3 retries for failed requests (except 4xx client errors)
- **Refetch on Focus**: Enabled for mobile app responsiveness
- **Network Mode**: Online-only (queries only run when online)

## Usage

### Basic Query Hook

```typescript
import { useQuery } from "@tanstack/react-query";

function useUserData(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId),
    enabled: !!userId, // Only run when userId exists
  });
}
```

### Basic Mutation Hook

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";

function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData) => updateUser(userData),
    onSuccess: () => {
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
```

### Using in Components

```typescript
function UserProfile({ userId }) {
  const { data, isLoading, error } = useUserData(userId);
  const updateUserMutation = useUpdateUser();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Error loading user</Text>;

  return (
    <View>
      <Text>{data.name}</Text>
      <Button
        title="Update"
        onPress={() => updateUserMutation.mutate({ name: "New Name" })}
        disabled={updateUserMutation.isPending}
      />
    </View>
  );
}
```

## Available Hooks

Check `hooks/use-api.ts` for pre-built hooks:

- `useUserProfile(userId)` - Fetch user profile data
- `useUpdateUserProfile()` - Update user profile
- `useDashboardData()` - Fetch dashboard statistics

## Best Practices

1. **Query Keys**: Use descriptive, hierarchical keys like `["users", userId, "posts"]`
2. **Error Handling**: Always handle loading and error states
3. **Caching**: Leverage stale-while-revalidate pattern
4. **Invalidation**: Invalidate related queries after mutations
5. **Optimistic Updates**: Update UI immediately, rollback on error

## Development

React Query DevTools are not available for React Native. Use Flipper or other debugging tools for development.

For more information, visit the [TanStack Query documentation](https://tanstack.com/query).
