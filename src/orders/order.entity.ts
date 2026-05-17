import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryColumn()
  id: string;

  @Column()
  customer: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  address: string;

  @Column()
  date: string;

  @Column('decimal')
  total: number;

  @Column()
  status: string;

  @Column({ nullable: true })
  paymentMethod: string;

  @Column()
  items: number;

  @Column({ type: 'simple-json', nullable: true })
  itemsList: any[];
}
