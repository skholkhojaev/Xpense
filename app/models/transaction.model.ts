export interface Transaction {
    id?: string;
    amount: number;
    category: string;
    date: Date;
    location?: {
      latitude: number;
      longitude: number;
    };
    userId: string;
  }