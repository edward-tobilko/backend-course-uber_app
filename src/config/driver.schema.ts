import { z } from 'zod';

import { VehicleFeature } from '@/types/drivers.types';

export const driverSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  phoneNumber: z.string(),
  email: z.string().email(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.number().min(1900).max(new Date().getFullYear()),
  vehicleLicensePlate: z.string(),
  vehicleDescription: z.string().nullable().optional(),
  vehicleFeatures: z.nativeEnum(VehicleFeature).array(),
  createdAt: z.date(),
});
