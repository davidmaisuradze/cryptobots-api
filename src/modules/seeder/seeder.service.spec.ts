import { Test, TestingModule } from '@nestjs/testing';
import { SeederService } from './seeder.service';

describe('Seeder', () => {
  let provider: SeederService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeederService],
    }).compile();

    provider = module.get<SeederService>(SeederService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
