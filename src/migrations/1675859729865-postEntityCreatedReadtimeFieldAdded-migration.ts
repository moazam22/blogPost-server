import { MigrationInterface, QueryRunner } from "typeorm";

export class postEntityCreatedReadtimeFieldAddedMigration1675859729865 implements MigrationInterface {
    name = 'postEntityCreatedReadtimeFieldAddedMigration1675859729865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "readTime" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "readTime"`);
    }

}
