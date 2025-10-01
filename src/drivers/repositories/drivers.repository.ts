import { log } from 'node:console';

import { dataBase } from '../../db/mock-db';
import { DriverInputDto } from '../dto/driver-input-dto.type';
import { DriverType } from '../types/driver.types';

export const driversRepository = {
  // * Найти всех водителей
  findAll(): DriverType[] {
    return dataBase.drivers;
  },

  // * Найти водителя по ID
  findDriverById(driverId: number): DriverType | null {
    // * ищем водителя в бд по id
    return dataBase.drivers.find((driver) => driver.id === driverId) ?? null; // Если результат поиска равно null или undefined, то вернем null.
  },

  // * Создать нового водителя
  create(newDriver: DriverType): DriverType {
    // * добавляем newDriver в БД
    dataBase.drivers.push(newDriver);

    return newDriver;
  },

  // * Удалить водителя
  delete(id: number): void {
    // * знаходимо індекс водія, якого ми хочемо видалити
    for (let index = 0; index < dataBase.drivers.length; index++) {
      let driver = dataBase.drivers[index];

      if (driver.id === id) {
        // * видаляємо один елемент
        dataBase.drivers.splice(index, 1);
        return;
      }
    }
  },

  // * Обновить данные водителя (отправляем весь обьект)
  updatePut(id: number, dto: DriverInputDto): void {
    // * знаходимо нам потрібного драйвера
    const driver = dataBase.drivers.find((driver) => driver.id === id);

    // * перевіряємо, якщо водія не знайдено, то викидуємо помилку
    if (!driver) {
      throw new Error('Driver not exist');
    }

    log('driver ->', driver);

    // * змінюємо поля, які нам потрібні, але обʼєкт потрібно надсилати весь
    driver.name = dto.name;
    driver.phoneNumber = dto.phoneNumber;
    driver.email = dto.email;
    driver.vehicleMake = dto.vehicleMake;
    driver.vehicleModel = dto.vehicleModel;
    driver.vehicleYear = dto.vehicleYear;
    driver.vehicleLicensePlate = dto.vehicleLicensePlate;
    driver.vehicleDescription = dto.vehicleDescription;
    driver.vehicleFeatures = dto.vehicleFeatures;

    return;
  },

  // * Обновить данные водителя (отправляем только то поле обьекта, которую изменили)
  updatePatch(
    id: number,
    dto: Partial<Pick<DriverInputDto, 'name'>>,
  ): DriverType {
    // * знаходимо нам потрібного драйвера
    const driver = dataBase.drivers.find((driver) => driver.id === id);

    // * перевіряємо, якщо водія не знайдено, то викидуємо помилку
    if (!driver) {
      throw new Error('Driver not exist');
    }

    log('driver ->', driver);

    if (typeof dto.name === 'string') {
      driver.name = dto.name;
    }

    return driver;
  },
};

// ? Пояснення для updatePatch:
// * Pick - бере тільки вибрані поля з типу. Тут ми кажемо: «візьми тільки поле name з DriverInputDto.
// * Partial<...> - Partial робить усі поля необов’язковими (додає ?).
