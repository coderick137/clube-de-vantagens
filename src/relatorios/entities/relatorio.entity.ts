import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';

@Entity('relatorios_vendas')
export class Relatorio {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Compra, (compra) => compra.id)
  compras: Compra[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataGeracao: Date;

  @Column({ type: 'date' })
  dataInicio: Date;

  @Column({ type: 'date' })
  dataFim: Date;

  @Column({ type: 'integer' })
  totalVendas: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalReceita: number;
}
