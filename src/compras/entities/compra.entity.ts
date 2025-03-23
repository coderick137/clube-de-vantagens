import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { CompraProduto } from './compra-produto.entity';

export enum CompraStatus {
  PENDENTE = 'Pendente',
  PAGO = 'Pago',
}

@Entity('compras')
export class Compra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cliente, { eager: true, onDelete: 'CASCADE' })
  cliente: Cliente;

  @OneToMany(() => CompraProduto, (produto) => produto.compra, {
    cascade: true,
  })
  produtos: CompraProduto[];

  @Column({ type: 'enum', enum: CompraStatus, default: CompraStatus.PENDENTE })
  status: CompraStatus;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
