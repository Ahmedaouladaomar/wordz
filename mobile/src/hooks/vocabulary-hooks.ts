import { delay } from "@/api/client";
import {
  vocabularyQueryKeys,
  vocabularyService,
} from "@/services/vocabularyService";
import {
  CreateVocabularyPayload,
  VocabularyPagination,
} from "@/types/vocabulary";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch unmastered vocabulary
 */
export function useUnmasteredTerms(
  params: VocabularyPagination,
  delayMs: number = 1000,
) {
  return useQuery({
    queryKey: vocabularyQueryKeys.unmastered({ ...params, isMastered: false }),
    queryFn: async (params) => {
      await delay(delayMs);
      return vocabularyService.getVocabularies({
        ...params,
        isMastered: false,
      });
    },
  });
}

/**
 * Hook to add vocabulary
 */
export function useAddVocabulary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVocabularyPayload) =>
      vocabularyService.createVocabulary(payload),
    onSuccess: () => {
      // Invalidate and refetch unmastered terms data
      queryClient.invalidateQueries({
        queryKey: vocabularyQueryKeys.unmasteredList(),
      });
    },
  });
}

/**
 * Hook to update an existing vocabulary entry
 */
export function useUpdateVocabulary(delayMs: number = 1000) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<CreateVocabularyPayload>;
    }) => {
      return Promise.all([
        delay(delayMs),
        vocabularyService.updateVocabulary(id, payload),
      ]);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: vocabularyQueryKeys.lists(),
      });
    },
  });
}
