import { SortOrder } from "./api";

export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
  example: string;
  userId: string;
  isMastered: boolean;
  isFavourite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateVocabularyPayload {
  term: string;
  definition: string;
  example: string;
  isMastered?: boolean;
  isFavourite?: boolean;
}

export interface VocabularyPagination {
  page?: number;
  take?: number;
  orderBy?: string;
  sortOrder?: SortOrder;
  search?: string;
}

export interface VocabularyFilters {
  isFavourite?: boolean;
  isMastered?: boolean;
}

export interface VocabularyQuery
  extends VocabularyPagination, VocabularyFilters {}
