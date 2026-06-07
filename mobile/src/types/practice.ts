import { Vocabulary } from "./vocabulary";

export interface Practice {
  id: string;
  totalWords: number;
  isCompleted: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  /** Each practice session stores submitted vocabulary */
  vocabularies?: Vocabulary[];
}
