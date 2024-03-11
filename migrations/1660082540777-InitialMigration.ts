import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1660082540777 implements MigrationInterface {
  name = 'InitialMigration1660082540777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TABLE "tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "accessToken" character varying, "refreshToken" character varying, "lastActivity" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "firstName" character varying, "lastName" character varying, "address" character varying NOT NULL, "signNonce" bigint, "email" character varying, "isActive" boolean NOT NULL DEFAULT false, "tokenId" uuid, CONSTRAINT "UQ_b0ec0293d53a1385955f9834d5c" UNIQUE ("address"), CONSTRAINT "REL_d98a275f8bc6cd986fcbe2eab0" UNIQUE ("tokenId"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))');
    await queryRunner.query('CREATE TABLE "market" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "price" double precision, "currency" character varying, "name" character varying, "description" character varying, "ownerAddress" character varying, "receivedOffer" double precision, "blockchainStatus" character varying, CONSTRAINT "PK_1e9a2963edfd331d92018e3abac" PRIMARY KEY ("id"))');
    await queryRunner.query('ALTER TABLE "users" ADD CONSTRAINT "FK_d98a275f8bc6cd986fcbe2eab01" FOREIGN KEY ("tokenId") REFERENCES "tokens"("id") ON DELETE NO ACTION ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP CONSTRAINT "FK_d98a275f8bc6cd986fcbe2eab01"');
    await queryRunner.query('DROP TABLE "market"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP TABLE "tokens"');
  }

}
