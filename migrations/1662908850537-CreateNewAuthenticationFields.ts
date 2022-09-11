import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateNewAuthenticationFields1662908850537 implements MigrationInterface {
  name = 'CreateNewAuthenticationFields1662908850537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "UQ_b0ec0293d53a1385955f9834d5c"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "address"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "signNonce"');
    await queryRunner.query('ALTER TABLE "users" ADD "password" character varying');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "password"');
    await queryRunner.query('ALTER TABLE "users" ADD "signNonce" bigint');
    await queryRunner.query('ALTER TABLE "users" ADD "address" character varying NOT NULL');
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "UQ_b0ec0293d53a1385955f9834d5c" UNIQUE ("address")');
  }
}
