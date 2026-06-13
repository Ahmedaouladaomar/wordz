export interface UserLevel {
  rank: number;
  totalWords: number;
  title: string;
}

export const USER_LEVELS: UserLevel[] = [
  { rank: 1, totalWords: 0, title: 'novice' },
  { rank: 2, totalWords: 20, title: 'explorer' },
  { rank: 3, totalWords: 50, title: 'enthusiast' },
  { rank: 4, totalWords: 100, title: 'master' },
];
