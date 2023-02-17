import { MigrationInterface, QueryRunner } from "typeorm";

export class commentParentIdAddedsetnullabletrueMigration1676275002183 implements MigrationInterface {
    name = 'commentParentIdAddedsetnullabletrueMigration1676275002183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "parentId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "parentId"`);
    }

}
