import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

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
    enum: ['admin', 'cliente'],
    default: 'cliente',
  })
  tipo: 'admin' | 'cliente';

  @CreateDateColumn({
    name: 'criado_em',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
