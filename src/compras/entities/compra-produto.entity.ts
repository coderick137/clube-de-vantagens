import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produtos/entities/produto.entity';
import { Compra } from './compra.entity';

@Entity('compras_produtos')
export class CompraProduto {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Compra, (compra) => compra.produtos)
  compra: Compra;

  @ManyToOne(() => Produto, (produto) => produto.comprasProduto, {
    cascade: true,
  })
  produto: Produto;

  @Column({ type: 'int', nullable: false })
  quantidade: number;
}
