export interface Vocabulary {
  id: string;
  term: string;
  definition: string;
  example: string;
  userId: string;
  isMastered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVocabularyPayload {
  term: string;
  definition: string;
  example: string;
}
