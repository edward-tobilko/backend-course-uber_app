export type DriversName = "" | "" | "" | "";

export interface Driver {
  driverId: number;
  status: string;
  createdAt: number;
}

export interface DataBase {
  drivers: Driver[];
}
