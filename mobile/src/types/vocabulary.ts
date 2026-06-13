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
