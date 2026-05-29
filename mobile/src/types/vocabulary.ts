export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
  example: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVocabularyPayload {
  term: string;
  definition: string;
  example: string;
}

export interface TrendingVocabulary {
  id: string;
  word: string;
  count: number;
}
