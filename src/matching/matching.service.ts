import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { OrderService } from '../orders/orders.service';
import Redis from 'ioredis';
import { DriverService } from '../drivers/drivers.service';

@Injectable()
export class MatchingService {
  constructor(
    @InjectQueue('assign-order-queue') private orderQueue: Queue,
    private orderService: OrderService,
    private readonly redis: Redis,
    private driverService: DriverService
  ) {}

  //   a = sin²(Δφ / 2) + cos(φ1) ⋅ cos(φ2) ⋅ sin²(Δλ / 2)

  // c = 2 ⋅ atan2(√a, √(1 − a))

  // d = R ⋅ c

  async enqueOrder(orderId: string) {
    this.orderQueue.add('order-job', {
      orderId,
    });
  }

  private haversine(lat1, long1, lat2, long2) {
    const convertToRadians = (angle) => (angle * Math.PI) / 180;
    const differenceInLatitude = convertToRadians(lat2 - lat1);
    const differenceInLongitude = convertToRadians(long2 - long1);
    const RADIUS = 6371;

    const a =
      Math.sin(differenceInLatitude / 2) ** 2 +
      Math.cos(convertToRadians(lat1)) *
        Math.cos(convertToRadians(lat2)) *
        Math.sin(differenceInLongitude / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = RADIUS * c;

    return d;
  }

  private calculateIdleTimeScore(lastActive: Date): number {
    const now = new Date().getTime();
    const last = new Date(lastActive).getTime();
    const idleTimeInMinutes = (now - last) / (1000 * 60);
    return idleTimeInMinutes;
  }

   private async getAvailableDriverIds(): Promise<string[]> {
    const key = 'drivers:available';
    return this.redis.smembers(key); // Set of available driver IDs
  }

  async matchDriverToOrder(orderId) {
    const order = await this.orderService.getOrderById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }


    const driverIds = await this.getAvailableDriverIds();
    if (!driverIds.length) throw new Error('No available drivers in Redis');

    const driverScores = [];

    for (const driverId of driverIds) {
      const location = await this.getDriverLocation(driverId);
      if (!location) continue;

      const driver = await this.driverService.findUnique({ where: { id: driverId } });
      if (!driver || driver.status !== 'available') continue;

      const distance = this.haversine(order.data., order.pickupLng, location.latitude, location.longitude);
      const idleTimeScore = this.calculateIdleTimeScore(driver.lastActive);
      const weightedScore = distance * 0.6 + idleTimeScore * 0.4;

      driverScores.push({ driver, score: weightedScore });
    }

    if (!driverScores.length) throw new Error('No drivers with valid locations');

    driverScores.sort((a, b) => a.score - b.score);

    const bestDriver = driverScores[0].driver;

    await this.ordersService.assignDriver(order.id, bestDriver.id);

    await this.prisma.driver.update({
      where: { id: bestDriver.id },
      data: { status: 'unavailable' },
    });

    await this.redis.srem('drivers:available', bestDriver.id);

    return {
      matched: true,
      orderId: order.id,
      driverId: bestDriver.id,
    };

    // private async getAvailableDriverIds(): Promise<string[]> {
    //     const key = 'drivers:available';
    //     return this.redis.smembers(key); // Set of available driver IDs
    //   }

    //   private calculateIdleTimeScore(lastActive: Date): number {
    //     const now = new Date().getTime();
    //     const last = new Date(lastActive).getTime();
    //     const idleTimeInMinutes = (now - last) / (1000 * 60);
    //     return idleTimeInMinutes;
    //   }
  }
}
