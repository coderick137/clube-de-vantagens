import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { CompraProduto } from '../../compras/entities/compra-produto.entity';

@Entity('produtos')
export class Produto {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 100, nullable: false })
  nome: string;

  @Column({ length: 255, nullable: true })
  descricao: string;

  @Column({ length: 100, nullable: false })
  categoria: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: false })
  preco: number;

  @OneToMany(() => CompraProduto, (compraProduto) => compraProduto.produto)
  comprasProduto: CompraProduto[];

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
