import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Compra } from '../../compras/entities/compra.entity';

export enum TipoCliente {
  ADMIN = 'admin',
  CLIENTE = 'cliente',
}

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ nullable: false, length: 255 })
  nome: string;

  @Column({ unique: true, nullable: false, length: 255 })
  email: string;

  @Column({ type: 'text', nullable: false })
  senha: string;

  @Column({
    type: 'enum',
    enum: TipoCliente,
    default: TipoCliente.CLIENTE,
  })
  tipo: TipoCliente;

  @OneToMany(() => Compra, (compra) => compra.cliente)
  compras: Compra[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
