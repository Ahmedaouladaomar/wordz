import { delay } from "@/api/client";
import { vocabularyQueryKeys } from "@/services/vocabularyService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { practiceService } from "../services/practiceService";

/**
 * Hook to update total words of existing practice entry
 */
export function useUpdatePracticeTotalWords(delayMs: number = 1000) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { totalWords: number; vocabularyId: string };
    }) => {
      return Promise.all([
        delay(delayMs),
        practiceService.updateTotalWords(id, payload),
      ]);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vocabularyQueryKeys.unmasteredList(),
      });
    },
  });
}

/**
 * Hook to delete practice
 */
export function useDeletePractice(delayMs: number = 1000) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      return Promise.all([delay(delayMs), practiceService.deletePractice(id)]);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vocabularyQueryKeys.unmasteredList(),
      });
    },
  });
}
