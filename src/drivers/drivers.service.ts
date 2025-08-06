import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { DriverLocationInterface } from './drivers.interface';

@Injectable()
export class DriverService {
      constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

async setDriverLocation(body: DriverLocationInterface) {
    const {driverId, latitude, longitude} = body
    const key = `driver:${driverId}:location`;
    await this.redis.set(key, JSON.stringify({ latitude, longitude }));
  }

async getDriverLocation(driverId: string) {
    const key = `driver:${driverId}:location`;
    const result = await this.redis.get(key);
    return result ? JSON.parse(result) : null;
  }




}


  