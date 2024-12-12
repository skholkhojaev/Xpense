import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
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

  constructor(
    private supabaseService: SupabaseService,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadTransactions();
  }

  async loadTransactions() {
    this.isLoading = true;
    try {
      const { data, error } = await this.supabaseService.getTransactions();
      if (error) throw error;
      this.transactions = data;
    } catch (error) {
      console.error('Error loading transactions:', error);
      this.showToast('Failed to load transactions');
    } finally {
      this.isLoading = false;
    }
  }

  async addTransaction() {
    const today = new Date().toISOString().split('T')[0];
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
          placeholder: 'What did you buy?'
        },
        {
          name: 'date',
          type: 'date',
          value: today,
          placeholder: 'Date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Add without location',
          handler: (data) => {
            this.createTransaction(data);
          }
        },
        {
          text: 'Add with location',
          handler: (data) => {
            this.createTransactionWithLocation(data);
          }
        }
      ]
    });

    await alert.present();
  }

  async createTransaction(transactionData: Partial<Transaction>) {
    const loading = await this.loadingController.create({ message: 'Adding transaction...' });
    await loading.present();

    try {
      const { data, error } = await this.supabaseService.addTransaction(transactionData);
      if (error) throw error;
      this.transactions.unshift(data[0]);
      await this.supabaseService.checkSpendingLimit(data[0].amount);
      this.showToast('Transaction added successfully');
    } catch (error) {
      console.error('Error adding transaction:', error);
      this.showToast('Failed to add transaction');
    } finally {
      loading.dismiss();
    }
  }

  async createTransactionWithLocation(transactionData: Partial<Transaction>) {
    const loading = await this.loadingController.create({ message: 'Adding transaction with location...' });
    await loading.present();

    try {
      const coordinates = await Geolocation.getCurrentPosition();
      transactionData.latitude = coordinates.coords.latitude;
      transactionData.longitude = coordinates.coords.longitude;

      const { data, error } = await this.supabaseService.addTransaction(transactionData);
      if (error) throw error;
      this.transactions.unshift(data[0]);
      this.showToast('Transaction added successfully with location');
    } catch (error) {
      console.error('Error adding transaction with location:', error);
      this.showToast('Failed to add transaction with location');
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
        { name: 'description', type: 'text', placeholder: 'What did you buy?', value: transaction.description },
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
      if (index !== -1) {
        this.transactions[index] = data[0];
      }
      this.showToast('Transaction updated successfully');
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

