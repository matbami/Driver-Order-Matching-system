import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MatchingService } from './matching.service';
import { AssignOrderProcessor } from './assign-order.processor';
import { OrderService } from '../orders/orders.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'assign-order-queue',
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
  providers: [MatchingService, OrderService,PrismaService, AssignOrderProcessor],
  exports: [MatchingService],
})
export class MatchingModule {}
