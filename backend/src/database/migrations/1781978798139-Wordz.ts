import { MigrationInterface, QueryRunner } from "typeorm";

export class Wordz1781978798139 implements MigrationInterface {
    name = 'Wordz1781978798139'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP CONSTRAINT "FK_saf3223r3wfewfsfsssp"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "practiceId"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "practiceId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "practiceId"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "practiceId" uuid`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD CONSTRAINT "FK_saf3223r3wfewfsfsssp" FOREIGN KEY ("practiceId") REFERENCES "practices"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
