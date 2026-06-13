import { ApiResponse } from "@/types/api";
import { CreateVocabularyPayload, Vocabulary } from "@/types/vocabulary";
import { BaseApiService } from "./baseApiService";

// Query keys
export const vocabularyQueryKeys = {
  all: ["vocabulary"] as const,
  list: () => [...vocabularyQueryKeys.all, "list"] as const,
  detail: (vocabularyId: string) =>
    [...vocabularyQueryKeys.all, "detail", vocabularyId] as const,
  trending: () => [...vocabularyQueryKeys.all, "trending"] as const,
  favorites: () => [...vocabularyQueryKeys.all, "favorites"] as const,
  mastered: () => [...vocabularyQueryKeys.all, "mastered"] as const,
};

class VocabularyService extends BaseApiService {
  protected readonly prefix = "/vocabulary";

  /**
   * Create a new vocabulary entry
   */
  async createVocabulary(
    payload: CreateVocabularyPayload,
  ): Promise<ApiResponse<Vocabulary>> {
    return this.handleRequest<Vocabulary>("", "post", payload);
  }

  /**
   * Get all vocabularies for the current user
   */
  async getVocabularies(
    params = {},
  ): Promise<ApiResponse<{ items: Vocabulary[]; meta: any }>> {
    return this.handleRequest<{ items: Vocabulary[]; meta: any }>(
      "",
      "get",
      params,
    );
  }

  /**
   * Get a specific vocabulary by ID
   */
  async getVocabulary(vocabularyId: string): Promise<ApiResponse<Vocabulary>> {
    return this.handleRequest<Vocabulary>(`/${vocabularyId}`, "get");
  }

  /**
   * Update a vocabulary entry
   */
  async updateVocabulary(
    vocabularyId: string,
    payload: Partial<CreateVocabularyPayload>,
  ): Promise<ApiResponse<Vocabulary>> {
    return this.handleRequest<Vocabulary>(`/${vocabularyId}`, "patch", payload);
  }

  /**
   * Delete a vocabulary entry
   */
  async deleteVocabulary(vocabularyId: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(`/${vocabularyId}`, "delete");
  }

  /**
   * Get favourite vocabularies for the current user
   */
  async getFavorites(
    params = {},
  ): Promise<ApiResponse<{ items: Vocabulary[]; meta: any }>> {
    return this.handleRequest<{ items: Vocabulary[]; meta: any }>(
      "/favorites",
      "get",
      params,
    );
  }

  /**
   * Get mastered vocabularies for the current user
   */
  async getMastered(
    params = {},
  ): Promise<ApiResponse<{ items: Vocabulary[]; meta: any }>> {
    return this.handleRequest<{ items: Vocabulary[]; meta: any }>(
      "/mastered",
      "get",
      params,
    );
  }

  /**
   * Toggle favorite status of a vocabulary
   */
  async toggleFavorite(vocabularyId: string): Promise<ApiResponse<Vocabulary>> {
    return this.handleRequest<Vocabulary>(`/${vocabularyId}/favorite`, "patch");
  }

  /**
   * Toggle mastered status of a vocabulary
   */
  async toggleMastered(vocabularyId: string): Promise<ApiResponse<Vocabulary>> {
    return this.handleRequest<Vocabulary>(`/${vocabularyId}/mastered`, "patch");
  }
}

// Export the singleton instance
export const vocabularyService = new VocabularyService();
