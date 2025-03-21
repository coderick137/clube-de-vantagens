import { Test, TestingModule } from '@nestjs/testing';
import { ClientesService } from '../service/clientes.service';
import { ClientesController } from './clientes.controller';

describe('ClientesController', () => {
  let controller: ClientesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [ClientesService],
    }).compile();

    controller = module.get<ClientesController>(ClientesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
