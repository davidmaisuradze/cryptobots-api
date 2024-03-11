import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddResetPasswordEntity1663701601467 implements MigrationInterface {
  name = 'AddResetPasswordEntity1663701601467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "reset_password_requests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "token" character varying NOT NULL, CONSTRAINT "PK_160a92fb6721b4085807e4936e0" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "users" ADD "resetPasswordRequestId" uuid');
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "UQ_3c41c5eb950a717eaa1854410ac" UNIQUE ("resetPasswordRequestId")');
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "FK_3c41c5eb950a717eaa1854410ac" FOREIGN KEY ("resetPasswordRequestId") REFERENCES "reset_password_requests"("id") ON DELETE SET NULL ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "FK_3c41c5eb950a717eaa1854410ac"');
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "UQ_3c41c5eb950a717eaa1854410ac"');
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "resetPasswordRequestId"');
    await queryRunner.query('DROP TABLE "reset_password_requests"');
  }

}
