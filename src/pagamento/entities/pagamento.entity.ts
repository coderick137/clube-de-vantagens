import { Entity, ManyToOne, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';

@Entity('pagamentos')
export class Pagamento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Compra, (compra) => compra.id)
  compra: Compra;

  @Column({ default: 'Pendente' })
  status: string;
}
