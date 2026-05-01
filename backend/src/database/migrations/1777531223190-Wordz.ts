import { MigrationInterface, QueryRunner } from 'typeorm';

export class Wordz1777531223190 implements MigrationInterface {
  name = 'Wordz1777531223190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "city" character varying`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "address" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "city"`);
  }
}
