import { MigrationInterface, QueryRunner } from "typeorm";

export class UserStreak1780121275257 implements MigrationInterface {
    name = 'UserStreak1780121275257'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "streak" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "sessions" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "sessions" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "streak"`);
    }

}
