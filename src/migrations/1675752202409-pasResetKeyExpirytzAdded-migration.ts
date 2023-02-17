import { MigrationInterface, QueryRunner } from "typeorm";

export class pasResetKeyExpirytzAddedMigration1675752202409 implements MigrationInterface {
    name = 'pasResetKeyExpirytzAddedMigration1675752202409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passResetKeyExpiry"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "passResetKeyExpiry" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passResetKeyExpiry"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "passResetKeyExpiry" TIMESTAMP`);
    }

}
