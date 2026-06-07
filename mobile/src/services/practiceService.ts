import { ApiResponse } from "@/types/api";
import { Practice } from "@/types/practice";
import { Vocabulary } from "@/types/vocabulary";
import { BaseApiService } from "./baseApiService";

// Query keys for practice
export const practiceQueryKeys = {
  all: ["practice"] as const,
  terms: () => [...practiceQueryKeys.all, "terms"] as const,
  unmasteredTerms: () =>
    [...practiceQueryKeys.all, "terms", "unmastered"] as const,
  today: () => [...practiceQueryKeys.all, "today"] as const,
};

class PracticeService extends BaseApiService {
  protected readonly prefix = "/practice";

  /**
   * Get unmastered vocabulary terms for practice
   */
  async getUnmasteredTerms(
    params = {},
  ): Promise<ApiResponse<{ items: Vocabulary[]; meta: any }>> {
    return this.handleRequest<{ items: Vocabulary[]; meta: any }>(
      "/unmastered",
      "get",
      params,
    );
  }

  /**
   * Get or create today's practice session
   * Returns the practice session with vocabulary items for today
   */
  async todayPractice(): Promise<ApiResponse<Practice>> {
    return this.handleRequest<Practice>("/today", "post");
  }

  /**
   * Update a practice session
   * Returns the updated practice session
   */
  async updatePractice(
    practiceId: string,
    payload: any,
  ): Promise<ApiResponse<Practice>> {
    return this.handleRequest<Practice>(`/${practiceId}`, "patch", payload);
  }

  /**
   * Update a practice session's total words
   * Returns the updated practice session
   */
  async updateTotalWords(
    practiceId: string,
    updateTotalWordsDto: {
      totalWords: number;
      vocabularyId: string;
    },
  ): Promise<ApiResponse<Practice>> {
    return this.handleRequest<Practice>(
      `/total-words/${practiceId}`,
      "patch",
      updateTotalWordsDto,
    );
  }

  /**
   * Complete a practice session
   */
  async completePractice(practiceId: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(`/${practiceId}/complete`, "post");
  }

  /**
   * Delete a practice session
   * Removes the practice session and all related data
   */
  async deletePractice(practiceId: string): Promise<ApiResponse<void>> {
    return this.handleRequest<void>(`/${practiceId}`, "delete");
  }
}

// Export the singleton instance
export const practiceService = new PracticeService();
