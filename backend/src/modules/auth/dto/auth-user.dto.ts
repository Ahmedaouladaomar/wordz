import { Expose } from 'class-transformer';
import { RoleType } from '@/constants/role-type';
import { USER_LEVELS } from '@/constants/user-levels';
import { type UserLevel } from '@/constants/user-levels';

export class AuthUserDto {
  readonly id!: string;
  readonly email!: string;
  readonly firstName!: string;
  readonly lastName!: string;
  readonly role!: RoleType;
  readonly sessionId!: string;
  readonly city?: string;
  readonly dailyTarget?: number;
  readonly totalPracticeSessions?: number;
  readonly refreshToken!: string;
  readonly vocabularies?: any[];
  readonly practices?: any[];

  constructor(user: AuthUserDto) {
    Object.assign(this, user);
  }

  @Expose()
  get totalWords(): number {
    return this.vocabularies?.filter((v) => v.isMastered)?.length || 0;
  }

  @Expose()
  get totalPracticeSssions() {
    return this.practices?.filter((p) => p.isCompleted)?.length || 0;
  }

  @Expose()
  get level(): UserLevel {
    const sortedLevels = [...USER_LEVELS].sort((a, b) => b.totalWords - a.totalWords);
    const matchedLvl = sortedLevels.find((lvl) => this.totalWords >= lvl.totalWords);
    return matchedLvl || USER_LEVELS[0];
  }

  /**
   * Helper to get full name for UI or Logs
   */
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  /**
   * Role Checks
   */
  get isAdmin(): boolean {
    return this.role === RoleType.ADMIN;
  }

  /**
   * Versatile check for custom logic
   */
  hasRole(requiredRole: RoleType): boolean {
    return this.role === requiredRole;
  }

  /**
   * Standardized log context
   */
  get logContext(): string {
    return `[User: ${this.id} | Role: ${this.role} | Session: ${this.sessionId}]`;
  }
}
