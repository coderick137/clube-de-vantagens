import { Test, TestingModule } from '@nestjs/testing';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from '../service/relatorios.service';

describe('RelatoriosController', () => {
  let controller: RelatoriosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RelatoriosController],
      providers: [RelatoriosService],
    }).compile();

    controller = module.get<RelatoriosController>(RelatoriosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
