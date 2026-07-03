import { MigrationInterface, QueryRunner } from "typeorm";

export class Wordz1782534678533 implements MigrationInterface {
    name = 'Wordz1782534678533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "practiceId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "practiceId" character varying`);
    }

}
