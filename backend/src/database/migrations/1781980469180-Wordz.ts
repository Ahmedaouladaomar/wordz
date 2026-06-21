import { MigrationInterface, QueryRunner } from "typeorm";

export class Wordz1781980469180 implements MigrationInterface {
    name = 'Wordz1781980469180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "practices_vocabularies_vocabularies" ("practicesId" uuid NOT NULL, "vocabulariesId" uuid NOT NULL, CONSTRAINT "PK_954239839684b3b6f5e3d175d79" PRIMARY KEY ("practicesId", "vocabulariesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_eab8eb070cc9f77e03d9d7a82c" ON "practices_vocabularies_vocabularies" ("practicesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_5e2ea7f7139ea8cd50cc3781bb" ON "practices_vocabularies_vocabularies" ("vocabulariesId") `);
        await queryRunner.query(`ALTER TABLE "practices_vocabularies_vocabularies" ADD CONSTRAINT "FK_eab8eb070cc9f77e03d9d7a82cf" FOREIGN KEY ("practicesId") REFERENCES "practices"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practices_vocabularies_vocabularies" ADD CONSTRAINT "FK_5e2ea7f7139ea8cd50cc3781bbf" FOREIGN KEY ("vocabulariesId") REFERENCES "vocabularies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "practices_vocabularies_vocabularies" DROP CONSTRAINT "FK_5e2ea7f7139ea8cd50cc3781bbf"`);
        await queryRunner.query(`ALTER TABLE "practices_vocabularies_vocabularies" DROP CONSTRAINT "FK_eab8eb070cc9f77e03d9d7a82cf"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e2ea7f7139ea8cd50cc3781bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_eab8eb070cc9f77e03d9d7a82c"`);
        await queryRunner.query(`DROP TABLE "practices_vocabularies_vocabularies"`);
    }

}
