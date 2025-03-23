import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoController } from './pagamento.controller';
import { PagamentoService } from '../service/pagamento.service';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { CompraStatus } from '../../compras/entities/compra.entity';

describe('PagamentoController', () => {
  let controller: PagamentoController;
  let pagamentoService: PagamentoService;

  const mockPagamentoService = {
    simulatePayment: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PagamentoController],
      providers: [
        {
          provide: PagamentoService,
          useValue: mockPagamentoService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PagamentoController>(PagamentoController);
    pagamentoService = module.get<PagamentoService>(PagamentoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('realizarPagamento', () => {
    const compraId = 1;
    const simulatedPayment = { id: 123, status: CompraStatus.PAGO };

    it('Deve processar um pagamento com sucesso', async () => {
      mockPagamentoService.simulatePayment.mockResolvedValue(simulatedPayment);

      const result = await controller.realizarPagamento(compraId);

      expect(result).toEqual({
        message: 'Pagamento realizado com sucesso',
        compra: compraId,
        pagamento: simulatedPayment,
      });
      expect(pagamentoService.simulatePayment).toHaveBeenCalledWith(compraId);
      expect(pagamentoService.simulatePayment).toHaveBeenCalledTimes(1);
    });

    it('Deve lançar um erro se o pagamento falhar', async () => {
      mockPagamentoService.simulatePayment.mockRejectedValue(
        new Error('Payment failed'),
      );

      await expect(controller.realizarPagamento(compraId)).rejects.toThrow(
        'Payment failed',
      );
      expect(pagamentoService.simulatePayment).toHaveBeenCalledWith(compraId);
      expect(pagamentoService.simulatePayment).toHaveBeenCalledTimes(1);
    });
  });
});
