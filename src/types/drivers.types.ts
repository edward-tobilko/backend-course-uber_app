export enum DriverStatus {
  Online = "online",
  Offline = "offline",
}

export type DriversName = "" | "" | "" | "";

export interface Driver {
  driverId: number;
  status: DriverStatus;
  createdAt: Date;
}

export interface DataBase {
  drivers: Driver[];
}
