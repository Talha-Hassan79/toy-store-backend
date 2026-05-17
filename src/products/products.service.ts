import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async onModuleInit() {
    const count = await this.productsRepository.count();
    if (count === 0) {
      await this.productsRepository.save([
        { name: 'Turbo Racing Car', category: 'Vehicles', price: 29.99, stock: 45, status: 'In Stock', image: 'https://images.unsplash.com/photo-1594787318286-3d835c1d207f?auto=format&fit=crop&q=80&w=150' },
        { name: 'Magic Builder Blocks', category: 'Educational', price: 49.99, stock: 12, status: 'Low Stock', image: 'https://images.unsplash.com/photo-1585338107529-13afc5f01586?auto=format&fit=crop&q=80&w=150' },
        { name: 'Fluffy Bear Plush', category: 'Soft Toys', price: 19.99, stock: 0, status: 'Out of Stock', image: 'https://images.unsplash.com/photo-1559449182-2624b30420e7?auto=format&fit=crop&q=80&w=150' },
        { name: 'Science Kit Pro', category: 'Learning', price: 79.99, stock: 88, status: 'In Stock', image: 'https://images.unsplash.com/photo-1530210124550-912dc1381cb8?auto=format&fit=crop&q=80&w=150' },
        { name: 'Dino Explorer Set', category: 'Figures', price: 34.99, stock: 25, status: 'In Stock', image: 'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=150' },
      ]);
    }
  }

  findAll() {
    return this.productsRepository.find();
  }

  findOne(id: number) {
    return this.productsRepository.findOneBy({ id });
  }

  create(product: Partial<Product>) {
    return this.productsRepository.save(product);
  }

  async update(id: number, data: Partial<Product>) {
    await this.productsRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    const product = await this.findOne(id);
    if (product) {
      await this.productsRepository.delete(id);
    }
    return product;
  }
}
