import { MigrationInterface, QueryRunner } from "typeorm";

export class Wordz1780811266910 implements MigrationInterface {
    name = 'Wordz1780811266910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "score"`);
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "results"`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "practiceDate" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "practiceId" uuid`);
        await queryRunner.query(`ALTER TABLE "practices" ADD CONSTRAINT "UQ_9e7a9879a78a283ecededb47535" UNIQUE ("userId", "practiceDate")`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD CONSTRAINT "FK_031afd38aaa62afa08914a551a1" FOREIGN KEY ("practiceId") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP CONSTRAINT "FK_031afd38aaa62afa08914a551a1"`);
        await queryRunner.query(`ALTER TABLE "practices" DROP CONSTRAINT "UQ_9e7a9879a78a283ecededb47535"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "practiceId"`);
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "practiceDate"`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "results" jsonb`);
        await queryRunner.query(`ALTER TABLE "practices" ADD "score" integer NOT NULL`);
    }

}
