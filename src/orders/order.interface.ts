export interface OrderInterface {
  customerId: string;
  pickupLat: number;
  pickupLng: number;
}

export interface updateOrderInterface {
  driverId?: string;
  status?: string;
 
}
