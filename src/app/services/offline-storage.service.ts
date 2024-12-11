import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {
  constructor() {}

  async saveTransaction(transaction: any) {
    const transactions = await this.getOfflineTransactions();
    transactions.push(transaction);
    await Preferences.set({
      key: 'offlineTransactions',
      value: JSON.stringify(transactions)
    });
  }

  async getOfflineTransactions() {
    const { value } = await Preferences.get({ key: 'offlineTransactions' });
    return value ? JSON.parse(value) : [];
  }

  async clearOfflineTransactions() {
    await Preferences.remove({ key: 'offlineTransactions' });
  }
}