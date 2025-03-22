import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from '../service/pagamento.service';
import { PagamentoController } from './pagamento.controller';

describe('PagamentoController', () => {
  let controller: PagamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentoController],
      providers: [PagamentoService],
    }).compile();

    controller = module.get<PagamentoController>(PagamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
