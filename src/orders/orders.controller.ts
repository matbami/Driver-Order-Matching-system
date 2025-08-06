import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { OrderService } from './orders.service';
import { OrderInterface, updateOrderInterface } from './order.interface';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() order: OrderInterface) {
    return await this.orderService.createOrder(order);
  }

  @Patch(':id')
  async updateOrder(
    @Body() orderUpdate: updateOrderInterface,
    @Param('id') orderId: string,
  ) {
    return await this.orderService.updateOrderStatus(orderId, orderUpdate);
  }

  @Get()
  async getOrderbyId(@Param('id') orderId: string) {
    return await this.orderService.getOrderById(orderId);
  }
}
