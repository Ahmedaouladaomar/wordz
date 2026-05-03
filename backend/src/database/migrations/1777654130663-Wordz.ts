import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wordz1777654130663 implements MigrationInterface {
  name = 'Wordz1777654130663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetToken"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetExpires"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetCode" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetCodeExpires" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetCodeExpires"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordResetCode"`);
    await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetExpires" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "users" ADD "passwordResetToken" character varying`);
  }
}
