import { MigrationInterface, QueryRunner } from "typeorm";

export class passwordResetKeyAddedMigration1675691205704 implements MigrationInterface {
    name = 'passwordResetKeyAddedMigration1675691205704'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "passwordResetKey" character varying(6) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passwordResetKey"`);
    }

}
