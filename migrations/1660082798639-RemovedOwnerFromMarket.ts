import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemovedOwnerFromMarket1660082798639 implements MigrationInterface {
  name = 'RemovedOwnerFromMarket1660082798639';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "market" DROP COLUMN "ownerAddress"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "market" ADD "ownerAddress" character varying');
  }

}
