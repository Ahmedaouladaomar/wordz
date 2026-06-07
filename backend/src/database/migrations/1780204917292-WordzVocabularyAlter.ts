import { MigrationInterface, QueryRunner } from "typeorm";

export class WordzVocabularyAlter1780204917292 implements MigrationInterface {
    name = 'WordzVocabularyAlter1780204917292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "isFavourite" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "vocabularies" ADD "isMastered" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "isMastered"`);
        await queryRunner.query(`ALTER TABLE "vocabularies" DROP COLUMN "isFavourite"`);
    }

}
