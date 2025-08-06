import { Body, Controller, Get, Post } from '@nestjs/common';
import { DriverService } from './drivers.service';
import { DriverLocationInterface } from './drivers.interface';

@Controller('drivers')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
    async setDriverLocation(@Body() driverBody:DriverLocationInterface ) {
    return await this.driverService.setDriverLocation(driverBody);
  }

}
