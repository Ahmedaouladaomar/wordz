import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wordz1777698589634 implements MigrationInterface {
  name = 'Wordz1777698589634';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerificationToken"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "emailVerificationCode" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "emailVerificationCodeExpires" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerificationCodeExpires"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerificationCode"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "emailVerificationToken" character varying`);
  }
}
