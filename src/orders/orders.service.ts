import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async onModuleInit() {
    const count = await this.ordersRepository.count();
    if (count === 0) {
      await this.ordersRepository.save([
        { 
          id: 'ORD-A1B2', customer: 'Sarah Miller', email: 'sarah@example.com', phone: '+1 234 567 890', 
          address: '123 Toy St, Play City, 12345', date: 'May 12, 2024', total: 124.99, status: 'Pending', 
          paymentMethod: 'card', items: 3,
          itemsList: [
            { name: 'Toy Car', price: 29.99, qty: 2, image: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=200' },
            { name: 'Magic Wand', price: 65.01, qty: 1, image: 'https://images.unsplash.com/photo-1532073150508-0e1df923bb5d?w=200' }
          ]
        },
        { 
          id: 'ORD-C3D4', customer: 'John Smith', email: 'john@example.com', phone: '+1 987 654 321', 
          address: '456 Brick Rd, Build Town, 67890', date: 'May 11, 2024', total: 54.50, status: 'Shipped', 
          paymentMethod: 'cod', items: 1,
          itemsList: [
            { name: 'Building Blocks', price: 54.50, qty: 1, image: 'https://images.unsplash.com/photo-1560343060-c140a58e9944?w=200' }
          ]
        },
        { 
          id: 'ORD-E5F6', customer: 'Emma Wilson', email: 'emma@example.com', phone: '+1 555 444 333', 
          address: '789 Doll Ave, Cute Ville, 54321', date: 'May 10, 2024', total: 210.00, status: 'Delivered', 
          paymentMethod: 'card', items: 2,
          itemsList: [
            { name: 'Barbie Doll', price: 105.00, qty: 2, image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=200' }
          ]
        },
        { 
          id: 'ORD-G7H8', customer: 'Michael Brown', email: 'michael@example.com', phone: '+1 111 222 333', 
          address: '321 Game Blvd, Fun Land, 09876', date: 'May 09, 2024', total: 89.99, status: 'Cancelled', 
          paymentMethod: 'card', items: 1,
          itemsList: [
            { name: 'Board Game', price: 89.99, qty: 1, image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=200' }
          ]
        },
      ]);
    }
  }

  findAll() {
    return this.ordersRepository.find();
  }

  findOne(id: string) {
    return this.ordersRepository.findOneBy({ id });
  }

  create(order: any) {
    const newOrder = { 
      ...order, 
      id: `ORD-${Math.random().toString(36).substr(2, 4).toUpperCase()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'Pending'
    };
    return this.ordersRepository.save(newOrder);
  }

  async updateStatus(id: string, status: string) {
    await this.ordersRepository.update(id, { status });
    return this.ordersRepository.findOneBy({ id });
  }
  
  async remove(id: string) {
    await this.ordersRepository.delete(id);
    return this.findAll();
  }
}
