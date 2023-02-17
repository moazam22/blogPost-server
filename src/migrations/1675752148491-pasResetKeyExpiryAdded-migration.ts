import { MigrationInterface, QueryRunner } from "typeorm";

export class pasResetKeyExpiryAddedMigration1675752148491 implements MigrationInterface {
    name = 'pasResetKeyExpiryAddedMigration1675752148491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "passResetKeyExpiry" TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "passResetKeyExpiry"`);
    }

}
