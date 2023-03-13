export interface RecordSchema {
  id: string;
  uid: string;
  tid?: string[];
  event: string;
  createAt: Date;
  updateAt: Date;
  deration: number;
}

export interface StatisticSchema {
  id: string;
  deration: number;
}