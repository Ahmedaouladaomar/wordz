import { MigrationInterface, QueryRunner } from "typeorm";

export class Wordz1780549847037 implements MigrationInterface {
    name = 'Wordz1780549847037'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practices" ADD "isCompleted" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practices" DROP COLUMN "isCompleted"`);
    }

}
