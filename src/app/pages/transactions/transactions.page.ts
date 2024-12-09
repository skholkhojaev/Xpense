import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { NotificationService } from '../../services/notification.service';
import { Geolocation } from '@capacitor/geolocation';

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: string;
  latitude?: number;
  longitude?: number;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  transactions: Transaction[] = [];
  isLoading = false;
  spendingLimit: number | null = null;

  constructor(
    private supabaseService: SupabaseService,
    private notificationService: NotificationService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTransactions();
    this.loadSpendingLimit();
  }

  async loadTransactions() {
    this.isLoading = true;
    try {
      const { data, error } = await this.supabaseService.getTransactions();
      if (error) throw error;
      this.transactions = data || [];
      this.checkMonthlyTotal();
    } catch (error) {
      console.error('Error loading transactions:', error);
      this.showToast('Failed to load transactions');
    } finally {
      this.isLoading = false;
    }
  }

  async loadSpendingLimit() {
    try {
      this.spendingLimit = await this.supabaseService.getSpendingLimit();
      this.checkMonthlyTotal();
    } catch (error) {
      console.error('Error loading spending limit:', error);
      this.showToast('Failed to load spending limit');
    }
  }

  checkMonthlyTotal() {
    if (this.spendingLimit !== null && this.transactions.length > 0) {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const monthlyTotal = this.transactions
        .filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);

      if (monthlyTotal > this.spendingLimit) {
        this.notificationService.setNotification(true);
        this.showToast(`You've exceeded your monthly spending limit of ${this.spendingLimit}!`);
      } else {
        this.notificationService.setNotification(false);
      }
    }
  }

  async addTransaction() {
    const alert = await this.alertController.create({
      header: 'Add Transaction',
      inputs: [
        {
          name: 'amount',
          type: 'number',
          placeholder: 'Amount'
        },
        {
          name: 'description',
          type: 'text',
          placeholder: 'Description'
        },
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add',
          handler: (data) => {
            if (!data.amount || !data.description || !data.date) {
              this.showToast('Please fill in all fields');
              return false;
            }
            this.createTransaction(data);
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async createTransaction(transactionData: any) {
    const loading = await this.loadingController.create({
      message: 'Adding transaction...'
    });
    await loading.present();

    try {
      let coordinates;
      try {
        coordinates = await Geolocation.getCurrentPosition();
        transactionData.latitude = coordinates.coords.latitude;
        transactionData.longitude = coordinates.coords.longitude;
      } catch (geoError) {
        console.warn('Geolocation error:', geoError);
      }

      const { data, error } = await this.supabaseService.addTransaction(transactionData);
      
      if (error) throw error;

      if (data && data.length > 0) {
        this.transactions.unshift(data[0]);
        this.showToast('Transaction added successfully');
        this.checkMonthlyTotal();
      } else {
        throw new Error('No data returned from Supabase');
      }
    } catch (error) {
      console.error('Error adding transaction:', error);
      this.showToast('Failed to add transaction: ' + ((error as Error).message || 'Unknown error'));
    } finally {
      loading.dismiss();
    }
  }

  viewTransactionDetail(transaction: Transaction) {
    this.router.navigate(['/transaction-detail', transaction.id]);
  }

  async editTransaction(transaction: Transaction) {
    const alert = await this.alertController.create({
      header: 'Edit Transaction',
      inputs: [
        { name: 'amount', type: 'number', placeholder: 'Amount', value: transaction.amount },
        { name: 'description', type: 'text', placeholder: 'Description', value: transaction.description },
        { name: 'date', type: 'date', placeholder: 'Date', value: transaction.date },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => this.updateTransaction(transaction.id, data),
        },
      ],
    });
    await alert.present();
  }

  async updateTransaction(id: string, transactionData: Partial<Transaction>) {
    const loading = await this.loadingController.create({ message: 'Updating transaction...' });
    await loading.present();

    try {
      const { data, error } = await this.supabaseService.updateTransaction(id, transactionData);
      if (error) throw error;
      const index = this.transactions.findIndex(t => t.id === id);
      if (index !== -1 && data) {
        this.transactions[index] = data[0];
      }
      this.showToast('Transaction updated successfully');
      this.checkMonthlyTotal();
    } catch (error) {
      console.error('Error updating transaction:', error);
      this.showToast('Failed to update transaction');
    } finally {
      loading.dismiss();
    }
  }

  async deleteTransaction(id: string) {
    const alert = await this.alertController.create({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this transaction?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          handler: () => this.performDelete(id),
        },
      ],
    });
    await alert.present();
  }

  async performDelete(id: string) {
    const loading = await this.loadingController.create({ message: 'Deleting transaction...' });
    await loading.present();

    try {
      const { error } = await this.supabaseService.deleteTransaction(id);
      if (error) throw error;
      this.transactions = this.transactions.filter(t => t.id !== id);
      this.showToast('Transaction deleted successfully');
      this.checkMonthlyTotal();
    } catch (error) {
      console.error('Error deleting transaction:', error);
      this.showToast('Failed to delete transaction');
    } finally {
      loading.dismiss();
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }
}

