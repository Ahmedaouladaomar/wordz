import { MigrationInterface, QueryRunner } from "typeorm";

export class UserStreakDate1780200603282 implements MigrationInterface {
    name = 'UserStreakDate1780200603282'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "lastStreakIncrementDate" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dailyTarget" SET DEFAULT '3'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "streak" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "streak" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "dailyTarget" SET DEFAULT '5'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "lastStreakIncrementDate"`);
    }

}
