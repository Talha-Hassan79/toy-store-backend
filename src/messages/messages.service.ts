import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  findAll() {
    return this.messagesRepository.find({ order: { createdAt: 'DESC' } });
  }

  create(data: Partial<Message>) {
    const message = this.messagesRepository.create(data);
    return this.messagesRepository.save(message);
  }

  async remove(id: number) {
    return this.messagesRepository.delete(id);
  }
}
