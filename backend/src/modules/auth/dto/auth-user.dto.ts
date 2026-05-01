import { RoleType } from '@/constants/role-type';

export class AuthUserDto {
  readonly userId!: string;
  readonly email!: string;
  readonly firstName!: string;
  readonly lastName!: string;
  readonly role!: RoleType;
  readonly sessionId!: string;
  readonly city?: string;
  readonly dailyTarget?: number;
  readonly refreshToken!: string;

  constructor(user: AuthUserDto) {
    Object.assign(this, user);
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
    return `[User: ${this.userId} | Role: ${this.role} | Session: ${this.sessionId}]`;
  }
}
