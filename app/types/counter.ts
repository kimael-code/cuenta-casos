export interface Counter {
  id: string;
  name: string;
  count: number;
  userId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
