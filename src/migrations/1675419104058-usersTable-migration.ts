import { MigrationInterface, QueryRunner } from "typeorm";

export class usersTableMigration1675419104058 implements MigrationInterface {
    name = 'usersTableMigration1675419104058'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "password" character varying(500) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "password"`);
    }

}
