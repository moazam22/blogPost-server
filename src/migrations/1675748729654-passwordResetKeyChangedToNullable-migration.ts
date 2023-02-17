import { MigrationInterface, QueryRunner } from "typeorm";

export class passwordResetKeyChangedToNullableMigration1675748729654 implements MigrationInterface {
    name = 'passwordResetKeyChangedToNullableMigration1675748729654'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordResetKey" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "passwordResetKey" SET NOT NULL`);
    }

}
