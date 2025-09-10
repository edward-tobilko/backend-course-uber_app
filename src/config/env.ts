import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(5001), // Render задає PORT як строку -> перетворюємо в число. Якщо немає — 3007
  HOST: z.string().default('0.0.0.0'), // Хост для прослуховування: на хостингу обов'язково 0.0.0.0
  SWAGGER: z // опційно: прапорець для Swagger у проді
    .string()
    .optional()
    .transform((v) => v === 'true')
    .default(false),
});

export const env = schema.parse(process.env);

// ! ПОЯСНЕННЯ
// * import { z } from "zod" - це бібліотека для схем і валідації даних у рантаймі з першокласною підтримкою TypeScript

// ? Навіщо
// * 1. Перевіряти вхідні дані (HTTP-запити, query/params, веб-форми, webhooks, env-змінні).
// * 2. Гарантувати типи: з однієї схеми отримуєш і рантайм-валідацію, і TS-тип через z.infer.

// * Документація: https://zod.dev
