import { useMutation, useQuery } from "@tanstack/react-query";
import {
    practiceQueryKeys,
    practiceService,
} from "../services/practiceService";

/**
 * Hook to fetch unmastered vocabulary terms for practice
 */
export function useUnmasteredTerms() {
  return useQuery({
    queryKey: practiceQueryKeys.unmasteredTerms(),
    queryFn: () => practiceService.getUnmasteredTerms(),
    enabled: true,
  });
}

/**
 * Hook to fetch or create today's practice session
 */
export function useTodayPractice() {
  return useQuery({
    queryKey: practiceQueryKeys.today(),
    queryFn: () => practiceService.getTodayPractice(),
    enabled: true,
  });
}

/**
 * Hook to complete a practice session
 */
export function useCompletePractice() {
  return useMutation({
    mutationFn: (practiceId: string) =>
      practiceService.completePractice(practiceId),
  });
}
