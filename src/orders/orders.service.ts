import { Injectable } from '@nestjs/common';
import { OrderInterface, updateOrderInterface } from './order.interface';
import { PrismaService } from '../prisma/prisma.service';
import { okResponseFormat } from '../utils/utils';

@Injectable()
export class OrderService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(body: OrderInterface) {
    const order = this.prisma.order.create({ data: body });
    return okResponseFormat('order created successfully');
  }

    async updateOrderStatus(id: string, updateBody: updateOrderInterface) {
    const order = this.prisma.order.update({
        where:{id},
        data: updateBody
    })
    return okResponseFormat('order created successfully');
  }

      async getOrderById(id: string) {
    const order = this.prisma.order.findUnique({
        where:{id},
    
    })
    return okResponseFormat('order retrieved successfully successfully', order);
  }

}
