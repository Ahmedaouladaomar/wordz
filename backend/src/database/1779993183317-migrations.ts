import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1779993183317 implements MigrationInterface {
    name = 'Migrations1779993183317'

    public async up(queryRunner: QueryRunner): Promise<void> {
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
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
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
    }

}
