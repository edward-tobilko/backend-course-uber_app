import { z } from 'zod';

import { VehicleFeature } from '@/types/driver.types';

// * тело, которое присылает клиент при создании
export const driverCreateSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string(),
  email: z.string().email(),
  vehicleMake: z.string(),
  vehicleModel: z.string(),
  vehicleYear: z.number().min(1900).max(new Date().getFullYear()),
  vehicleLicensePlate: z.string(),
  vehicleDescription: z.string().nullable().optional().default(null),
  vehicleFeatures: z.array(z.nativeEnum(VehicleFeature)).default([]),
});

// * Полная сущность в БД (если нужна для типизации чтения/обновления)
export const driverSchema = driverCreateSchema.extend({
  id: z.number().int().positive(),
  createdAt: z.date(),
});

// * Types
export type DriverCreateDTO = z.infer<typeof driverCreateSchema>;
export type DriverDTO = z.infer<typeof driverSchema>;
