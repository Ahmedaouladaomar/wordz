import { ApiResponse } from "@/types/api";
import {
  CreateVocabularyPayload,
  Vocabulary,
  VocabularyQuery
} from "@/types/vocabulary";
import { BaseApiService } from "./baseApiService";

// Query keys
export const vocabularyQueryKeys = {
  all: ["vocabulary"] as const,

  // Base endpoints trackers (Prefixes)
  lists: () => [...vocabularyQueryKeys.all, "list"] as const,
  details: () => [...vocabularyQueryKeys.all, "detail"] as const,

  // Specific list category trackers
  favouritesList: () => [...vocabularyQueryKeys.lists(), "favorites"] as const,
  masteredList: () => [...vocabularyQueryKeys.lists(), "mastered"] as const,
  unmasteredList: () => [...vocabularyQueryKeys.lists(), "unmastered"] as const,

  // Dynamic methods that accept parameters
  list: (params: VocabularyQuery) =>
    [...vocabularyQueryKeys.lists(), "all", params] as const,

  favourites: (params: VocabularyQuery) =>
    [...vocabularyQueryKeys.favouritesList(), params] as const,
  mastered: (params: VocabularyQuery) =>
    [...vocabularyQueryKeys.masteredList(), params] as const,
  unmastered: (params: VocabularyQuery) =>
    [...vocabularyQueryKeys.unmasteredList(), params] as const,

  detail: (vocabularyId: string) =>
    [...vocabularyQueryKeys.details(), vocabularyId] as const,
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
    params: VocabularyQuery = {},
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
