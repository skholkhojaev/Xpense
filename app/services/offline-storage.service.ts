import { Injectable } from '@angular/core';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {
  constructor() {}

  async saveTransaction(transaction: any) {
    const transactions = await this.getOfflineTransactions();
    transactions.push(transaction);
    await Storage.set({
      key: 'offlineTransactions',
      value: JSON.stringify(transactions)
    });
  }

  async getOfflineTransactions() {
    const { value } = await Storage.get({ key: 'offlineTransactions' });
    return value ? JSON.parse(value) : [];
  }

  async clearOfflineTransactions() {
    await Storage.remove({ key: 'offlineTransactions' });
  }
}

