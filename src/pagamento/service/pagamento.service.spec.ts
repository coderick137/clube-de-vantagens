import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoService } from './pagamento.service';
import { PagamentoRepository } from '../repository/pagamento.repository';
import { CompraRepository } from '../../compras/repositories/compra.repository';
import { NotFoundException } from '@nestjs/common';
import { CompraStatus } from '../../compras/entities/compra.entity';
import { Logger } from '@nestjs/common';
import { Cliente } from '../../clientes/entities/cliente.entity';

describe('PagamentoService', () => {
  let service: PagamentoService;
  let pagamentoRepository: PagamentoRepository;
  let compraRepository: CompraRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PagamentoService,
        {
          provide: PagamentoRepository,
          useValue: {
            findCompraById: jest.fn(),
            createPagamento: jest.fn(),
            updateCompraStatus: jest.fn(),
          },
        },
        {
          provide: CompraRepository,
          useValue: {
            findOne: jest.fn(),
            createCompra: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PagamentoService>(PagamentoService);
    pagamentoRepository = module.get<PagamentoRepository>(PagamentoRepository);
    compraRepository = module.get<CompraRepository>(CompraRepository);

    // Mock do Logger para evitar logs desnecessários durante os testes
    jest.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('simulatePayment', () => {
    it('deve simular o pagamento com sucesso', async () => {
      const compraId = 1;
      const compra = {
        id: compraId,
        status: CompraStatus.PENDENTE,
        produtos: [],
        cliente: { id: 1 } as Cliente,
        createdAt: new Date('2025-03-23T17:24:32.458Z'),
      };
      const pagamento = {
        id: 1,
        compraId,
        status: CompraStatus.PAGO,
        compra: compra,
      };

      jest
        .spyOn(pagamentoRepository, 'findCompraById')
        .mockResolvedValue(compra);
      jest
        .spyOn(pagamentoRepository, 'createPagamento')
        .mockResolvedValue(pagamento);
      jest
        .spyOn(pagamentoRepository, 'updateCompraStatus')
        .mockResolvedValue(undefined as any);

      const result = await service.simulatePayment(compraId);

      expect(result).toBe(pagamento);
      expect(pagamentoRepository.findCompraById).toHaveBeenCalledWith(compraId);
      expect(pagamentoRepository.createPagamento).toHaveBeenCalledWith(compra);
      expect(pagamentoRepository.updateCompraStatus).toHaveBeenCalledWith(
        compra,
        CompraStatus.PAGO,
      );
    });

    it('deve lançar NotFoundException se a compra não for encontrada', async () => {
      const compraId = 1;

      jest.spyOn(pagamentoRepository, 'findCompraById').mockResolvedValue(null);

      await expect(service.simulatePayment(compraId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar erro se a simulação de pagamento falhar', async () => {
      const compraId = 1;
      const compra = {
        id: compraId,
        status: CompraStatus.PENDENTE,
        produtos: [],
        cliente: { id: 1 } as Cliente,
        createdAt: new Date(),
      };
      const error = new Error('Erro ao simular pagamento');

      jest
        .spyOn(pagamentoRepository, 'findCompraById')
        .mockResolvedValue(compra);
      jest
        .spyOn(pagamentoRepository, 'createPagamento')
        .mockRejectedValue(error);

      await expect(service.simulatePayment(compraId)).rejects.toThrow(error);
      expect(pagamentoRepository.createPagamento).toHaveBeenCalledWith(compra);
    });
  });
});
