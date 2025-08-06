import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable } from '@nestjs/common';
import { MatchingService } from './matching.service';

@Processor('assign-order-queue')
@Injectable()
export class AssignOrderProcessor extends WorkerHost {
  constructor(private readonly matchingService: MatchingService) {
    super();
  }

  async process(job: Job) {
    const orderId = job.data.orderId;
        return this.matchingService.matchDriverToOrder(orderId);

    //matching algorithm
    // return await this.matchingService.(orderId);
  }
}

